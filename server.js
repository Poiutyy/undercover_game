/**
 * UNDERCOVER GAME SERVER
 * Node.js natif - aucune dépendance npm
 * Lancer : node server.js
 * Port : 3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ─── WORD LISTS ────────────────────────────────────────────────────────────────
let wordPairs = [
  { civilian: "Pizza", undercover: "Burger" },
  { civilian: "Chat", undercover: "Chien" },
  { civilian: "Plage", undercover: "Piscine" },
  { civilian: "Café", undercover: "Thé" },
  { civilian: "Voiture", undercover: "Moto" },
  { civilian: "Football", undercover: "Rugby" },
  { civilian: "Chocolat", undercover: "Caramel" },
  { civilian: "Montagne", undercover: "Colline" },
  { civilian: "Guitare", undercover: "Violon" },
  { civilian: "Avion", undercover: "Hélicoptère" },
  { civilian: "Soleil", undercover: "Lune" },
  { civilian: "Roi", undercover: "Président" },
  { civilian: "Vampire", undercover: "Zombie" },
  { civilian: "Bière", undercover: "Vin" },
  { civilian: "Cinéma", undercover: "Théâtre" },
];

// ─── GAME STATE ────────────────────────────────────────────────────────────────
let lobbies = {}; // lobbyCode -> lobby object

function generateCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function createLobby(hostName) {
  const code = generateCode();
  lobbies[code] = {
    code,
    host: null,
    players: [], // { id, name, ws, score, role, word, alive }
    settings: {
      maxPlayers: 6,
      rounds: 3,
      turnsPerRound: 2,
      turnTime: 30, // seconds, 0 = no limit
      mrWhiteMode: false,
    },
    state: 'lobby', // lobby | playing | voting | roundEnd | gameEnd
    currentRound: 0,
    currentTurn: 0,
    currentPlayerIndex: 0,
    turnOrder: [],
    hints: [], // [{playerId, playerName, hint, turn}]
    votes: {}, // voterId -> targetId
    wordPair: null,
    mrWhiteGuess: null,
  };
  return lobbies[code];
}

function getLobby(code) {
  return lobbies[code];
}

function broadcast(lobby, msg) {
  const data = JSON.stringify(msg);
  lobby.players.forEach(p => {
    if (p.ws && p.ws.readyState === 1) {
      p.ws.send(data);
    }
  });
}

function sendTo(player, msg) {
  if (player.ws && player.ws.readyState === 1) {
    player.ws.send(JSON.stringify(msg));
  }
}

function getLobbyPublicState(lobby) {
  return {
    code: lobby.code,
    state: lobby.state,
    settings: lobby.settings,
    currentRound: lobby.currentRound,
    currentTurn: lobby.currentTurn,
    currentPlayerIndex: lobby.currentPlayerIndex,
    turnOrder: lobby.turnOrder,
    hints: lobby.hints,
    votes: lobby.votes,
    players: lobby.players.map(p => ({
      id: p.id,
      name: p.name,
      score: p.score,
      alive: p.alive,
      isHost: lobby.host === p.id,
    })),
  };
}

function assignRoles(lobby) {
  const players = lobby.players.filter(p => p.alive !== false);
  const pairIndex = Math.floor(Math.random() * wordPairs.length);
  lobby.wordPair = wordPairs[pairIndex];

  // Shuffle players
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  // Pick 1 imposteur index
  const imposteurIdx = Math.floor(Math.random() * shuffled.length);

  shuffled.forEach((p, i) => {
    const player = lobby.players.find(x => x.id === p.id);
    if (i === imposteurIdx) {
      if (lobby.settings.mrWhiteMode) {
        // En mode Mr. White, l'imposteur EST Mr. White (pas de mot)
        player.role = 'mrwhite';
        player.word = null;
      } else {
        player.role = 'undercover';
        player.word = lobby.wordPair.undercover;
      }
    } else {
      player.role = 'civilian';
      player.word = lobby.wordPair.civilian;
    }
  });
}

function startRound(lobby) {
  lobby.currentRound++;
  lobby.currentTurn = 1;
  lobby.currentPlayerIndex = 0;
  lobby.hints = [];
  lobby.votes = {};
  lobby.mrWhiteGuess = null;
  lobby.state = 'playing';

  // Assign roles
  assignRoles(lobby);

  // Random turn order
  lobby.turnOrder = lobby.players.map(p => p.id).sort(() => Math.random() - 0.5);

  broadcast(lobby, { type: 'roundStart', state: getLobbyPublicState(lobby) });

  // Send each player their word privately
  lobby.players.forEach(p => {
    sendTo(p, { type: 'yourWord', word: p.word });
  });

  broadcastCurrentPlayer(lobby);
}

function broadcastCurrentPlayer(lobby) {
  const currentId = lobby.turnOrder[lobby.currentPlayerIndex];
  broadcast(lobby, {
    type: 'yourTurn',
    currentPlayerId: currentId,
    turn: lobby.currentTurn,
    round: lobby.currentRound,
    state: getLobbyPublicState(lobby),
  });
}

function nextTurn(lobby) {
  lobby.currentPlayerIndex++;

  if (lobby.currentPlayerIndex >= lobby.turnOrder.length) {
    // End of this turn
    if (lobby.currentTurn >= lobby.settings.turnsPerRound) {
      // Start voting
      startVoting(lobby);
    } else {
      lobby.currentTurn++;
      lobby.currentPlayerIndex = 0;
      broadcastCurrentPlayer(lobby);
    }
  } else {
    broadcastCurrentPlayer(lobby);
  }
}

function startVoting(lobby) {
  lobby.state = 'voting';
  lobby.votes = {};
  broadcast(lobby, { type: 'votingStart', state: getLobbyPublicState(lobby) });
}

function processVotes(lobby) {
  // Count votes
  const tally = {};
  lobby.players.forEach(p => { tally[p.id] = 0; });
  Object.values(lobby.votes).forEach(targetId => {
    tally[targetId] = (tally[targetId] || 0) + 1;
  });

  // Find most voted
  let maxVotes = 0;
  let eliminated = null;
  Object.entries(tally).forEach(([id, count]) => {
    if (count > maxVotes) { maxVotes = count; eliminated = id; }
  });

  const eliminatedPlayer = lobby.players.find(p => p.id === eliminated);
  // L'imposteur est soit 'undercover' soit 'mrwhite' (jamais les deux en même temps)
  const imposteurPlayer = lobby.players.find(p => p.role === 'undercover' || p.role === 'mrwhite');

  let roundResult = { eliminated: eliminated ? { id: eliminated, name: eliminatedPlayer?.name, role: eliminatedPlayer?.role } : null, tally };

  // Scoring
  if (eliminatedPlayer?.role === 'undercover' || eliminatedPlayer?.role === 'mrwhite') {
    // Civilians win this round - each civilian gets 100 pts
    lobby.players.forEach(p => {
      if (p.role === 'civilian') p.score = (p.score || 0) + 100;
    });
    roundResult.winner = 'civilians';

    // Si Mr. White est éliminé, il a le droit de deviner le mot
    if (eliminatedPlayer?.role === 'mrwhite') {
      roundResult.mrWhiteEliminated = true;
    }
  } else {
    // L'imposteur survit - il gagne 100 pts par vote non contre lui
    const nonVotesAgainst = lobby.players.length - (tally[imposteurPlayer?.id] || 0);
    if (imposteurPlayer) imposteurPlayer.score = (imposteurPlayer.score || 0) + nonVotesAgainst * 100;
    roundResult.winner = 'undercover';
  }

  lobby.state = 'roundEnd';
  broadcast(lobby, {
    type: 'roundEnd',
    roundResult,
    wordPair: lobby.wordPair,
    state: getLobbyPublicState(lobby),
  });

  // Check if game over
  if (lobby.currentRound >= lobby.settings.rounds) {
    setTimeout(() => endGame(lobby), 5000);
  }
}

function endGame(lobby) {
  lobby.state = 'gameEnd';
  const sorted = [...lobby.players].sort((a, b) => (b.score || 0) - (a.score || 0));
  broadcast(lobby, {
    type: 'gameEnd',
    leaderboard: sorted.map(p => ({ id: p.id, name: p.name, score: p.score || 0, role: p.role })),
    state: getLobbyPublicState(lobby),
  });

}

// ─── WEBSOCKET IMPLEMENTATION ──────────────────────────────────────────────────
// Pure Node.js WebSocket server (no ws package)

function generateWebSocketAccept(key) {
  return crypto.createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');
}

function parseWebSocketFrame(buffer) {
  if (buffer.length < 2) return null;
  const firstByte = buffer[0];
  const secondByte = buffer[1];
  const fin = (firstByte & 0x80) !== 0;
  const opcode = firstByte & 0x0f;
  const masked = (secondByte & 0x80) !== 0;
  let payloadLength = secondByte & 0x7f;
  let offset = 2;

  if (payloadLength === 126) {
    if (buffer.length < 4) return null;
    payloadLength = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLength === 127) {
    if (buffer.length < 10) return null;
    payloadLength = Number(buffer.readBigUInt64BE(2));
    offset = 10;
  }

  if (masked) {
    if (buffer.length < offset + 4 + payloadLength) return null;
    const mask = buffer.slice(offset, offset + 4);
    offset += 4;
    const payload = Buffer.alloc(payloadLength);
    for (let i = 0; i < payloadLength; i++) {
      payload[i] = buffer[offset + i] ^ mask[i % 4];
    }
    return { fin, opcode, payload };
  } else {
    if (buffer.length < offset + payloadLength) return null;
    return { fin, opcode, payload: buffer.slice(offset, offset + payloadLength) };
  }
}

function createWebSocketFrame(data) {
  const payload = Buffer.from(data, 'utf8');
  const len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81; // FIN + text opcode
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, payload]);
}

function createCloseFrame() {
  return Buffer.from([0x88, 0x00]);
}

// Simple WS object
function makeWS(socket) {
  const ws = {
    readyState: 1,
    _buffer: Buffer.alloc(0),
    _handlers: {},
    send(data) {
      try { socket.write(createWebSocketFrame(data)); } catch (e) {}
    },
    close() {
      try { socket.write(createCloseFrame()); socket.destroy(); } catch (e) {}
      ws.readyState = 3;
    },
    on(event, fn) { ws._handlers[event] = fn; return ws; },
  };

  socket.on('data', (chunk) => {
    ws._buffer = Buffer.concat([ws._buffer, chunk]);
    while (ws._buffer.length > 0) {
      const frame = parseWebSocketFrame(ws._buffer);
      if (!frame) break;
      // Calculate consumed bytes
      let consumed = 2;
      let pl = ws._buffer[1] & 0x7f;
      const masked = (ws._buffer[1] & 0x80) !== 0;
      if (pl === 126) consumed = 4;
      else if (pl === 127) consumed = 10;
      if (pl === 126) pl = ws._buffer.readUInt16BE(2);
      else if (pl === 127) pl = Number(ws._buffer.readBigUInt64BE(2));
      if (masked) consumed += 4;
      consumed += pl;
      ws._buffer = ws._buffer.slice(consumed);

      if (frame.opcode === 0x8) { // close
        ws.readyState = 3;
        if (ws._handlers['close']) ws._handlers['close']();
        socket.destroy();
        break;
      } else if (frame.opcode === 0x1) { // text
        if (ws._handlers['message']) ws._handlers['message'](frame.payload.toString('utf8'));
      } else if (frame.opcode === 0x9) { // ping
        socket.write(Buffer.from([0x8a, 0x00]));
      }
    }
  });

  socket.on('close', () => {
    ws.readyState = 3;
    if (ws._handlers['close']) ws._handlers['close']();
  });

  socket.on('error', () => {
    ws.readyState = 3;
    if (ws._handlers['close']) ws._handlers['close']();
  });

  return ws;
}

// ─── HTTP SERVER ────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  // API endpoints
  if (req.method === 'GET' && req.url === '/api/words') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(wordPairs));
    return;
  }

  if (req.method === 'POST' && req.url === '/api/words') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        wordPairs = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400); res.end('Bad JSON');
      }
    });
    return;
  }

  // Serve index.html
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

// ─── WEBSOCKET UPGRADE ─────────────────────────────────────────────────────────
server.on('upgrade', (req, socket) => {
  if (req.headers['upgrade'] !== 'websocket') {
    socket.destroy(); return;
  }
  const key = req.headers['sec-websocket-key'];
  const accept = generateWebSocketAccept(key);
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  );

  const ws = makeWS(socket);
  handleConnection(ws);
});

// ─── GAME MESSAGE HANDLER ──────────────────────────────────────────────────────
function handleConnection(ws) {
  let playerId = null;
  let lobbyCode = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    const { type } = msg;

    if (type === 'createLobby') {
      const lobby = createLobby(msg.name);
      playerId = crypto.randomUUID();
      lobbyCode = lobby.code;
      const player = { id: playerId, name: msg.name, ws, score: 0, role: null, word: null, alive: true };
      lobby.players.push(player);
      lobby.host = playerId;
      sendTo(player, { type: 'joined', playerId, lobbyCode, isHost: true, state: getLobbyPublicState(lobby) });
      return;
    }

    if (type === 'joinLobby') {
      const lobby = getLobby(msg.code);
      if (!lobby) { sendTo({ ws }, { type: 'error', msg: 'Lobby introuvable' }); return; }
      if (lobby.state !== 'lobby' && lobby.state !== 'gameEnd') { sendTo({ ws }, { type: 'error', msg: 'Partie en cours' }); return; }
      if (lobby.players.length >= lobby.settings.maxPlayers) { sendTo({ ws }, { type: 'error', msg: 'Lobby plein' }); return; }
      playerId = crypto.randomUUID();
      lobbyCode = lobby.code;
      const player = { id: playerId, name: msg.name, ws, score: 0, role: null, word: null, alive: true };
      lobby.players.push(player);
      sendTo(player, { type: 'joined', playerId, lobbyCode, isHost: false, state: getLobbyPublicState(lobby) });
      broadcast(lobby, { type: 'playerJoined', state: getLobbyPublicState(lobby) });
      return;
    }

    // From here, we need a lobby
    if (!lobbyCode) return;
    const lobby = getLobby(lobbyCode);
    if (!lobby) return;
    const player = lobby.players.find(p => p.id === playerId);
    if (!player) return;

    if (type === 'updateSettings') {
      if (lobby.host !== playerId) return;
      Object.assign(lobby.settings, msg.settings);
      broadcast(lobby, { type: 'settingsUpdated', settings: lobby.settings, state: getLobbyPublicState(lobby) });
      return;
    }

    if (type === 'startGame') {
      if (lobby.host !== playerId) return;
      if (lobby.players.length < 3) { sendTo(player, { type: 'error', msg: 'Minimum 3 joueurs' }); return; }
      lobby.players.forEach(p => { p.score = 0; });
      lobby.currentRound = 0;
      startRound(lobby);
      return;
    }

    if (type === 'submitHint') {
      if (lobby.state !== 'playing') return;
      const currentId = lobby.turnOrder[lobby.currentPlayerIndex];
      if (currentId !== playerId) return;
      lobby.hints.push({ playerId, playerName: player.name, hint: msg.hint, turn: lobby.currentTurn, round: lobby.currentRound });
      broadcast(lobby, { type: 'hintSubmitted', hints: lobby.hints, state: getLobbyPublicState(lobby) });
      nextTurn(lobby);
      return;
    }

    if (type === 'vote') {
      if (lobby.state !== 'voting') return;
      lobby.votes[playerId] = msg.targetId;
      broadcast(lobby, { type: 'voteUpdate', votes: Object.keys(lobby.votes).length, total: lobby.players.length, state: getLobbyPublicState(lobby) });
      // Auto-process when all voted
      if (Object.keys(lobby.votes).length >= lobby.players.length) {
        processVotes(lobby);
      }
      return;
    }

    if (type === 'mrWhiteGuess') {
      // Mr White guesses after being eliminated
      lobby.mrWhiteGuess = msg.guess;
      const civilianWord = lobby.wordPair?.civilian;
      const correct = msg.guess?.toLowerCase().trim() === civilianWord?.toLowerCase().trim();
      if (correct) {
        // Mr White wins! gets 200 bonus
        const mw = lobby.players.find(p => p.role === 'mrwhite');
        if (mw) mw.score = (mw.score || 0) + 200;
      }
      broadcast(lobby, { type: 'mrWhiteGuessResult', guess: msg.guess, correct, civilianWord, state: getLobbyPublicState(lobby) });
      if (lobby.currentRound >= lobby.settings.rounds) {
        setTimeout(() => endGame(lobby), 3000);
      }
      return;
    }

    if (type === 'nextRound') {
      if (lobby.host !== playerId) return;
      if (lobby.currentRound < lobby.settings.rounds) {
        startRound(lobby);
      } else {
        endGame(lobby);
      }
      return;
    }

    if (type === 'restartGame') {
      if (lobby.host !== playerId) return;
      lobby.currentRound = 0;
      lobby.state = 'lobby';
      lobby.players.forEach(p => { p.score = 0; p.role = null; p.word = null; });
      broadcast(lobby, { type: 'gameRestart', state: getLobbyPublicState(lobby) });
      return;
    }

    if (type === 'getWordList') {
      sendTo(player, { type: 'wordList', words: wordPairs });
      return;
    }

    if (type === 'updateWordList') {
      if (lobby.host !== playerId) return;
      wordPairs = msg.words;
      sendTo(player, { type: 'wordListUpdated', words: wordPairs });
      return;
    }

    if (type === 'skipTurn') {
      if (lobby.state !== 'playing') return;
      const currentId = lobby.turnOrder[lobby.currentPlayerIndex];
      if (currentId !== playerId && lobby.host !== playerId) return;
      lobby.hints.push({ playerId: currentId, playerName: lobby.players.find(p=>p.id===currentId)?.name, hint: '⏭️ (temps écoulé)', turn: lobby.currentTurn, round: lobby.currentRound });
      broadcast(lobby, { type: 'hintSubmitted', hints: lobby.hints, state: getLobbyPublicState(lobby) });
      nextTurn(lobby);
      return;
    }
  });

  ws.on('close', () => {
    if (!lobbyCode || !playerId) return;
    const lobby = getLobby(lobbyCode);
    if (!lobby) return;
    lobby.players = lobby.players.filter(p => p.id !== playerId);
    if (lobby.players.length === 0) {
      delete lobbies[lobbyCode];
      return;
    }
    if (lobby.host === playerId && lobby.players.length > 0) {
      lobby.host = lobby.players[0].id;
    }
    broadcast(lobby, { type: 'playerLeft', state: getLobbyPublicState(lobby) });
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎮 Undercover Server running on http://localhost:${PORT}`);
  console.log(`   WebSocket: ws://localhost:${PORT}`);
});
