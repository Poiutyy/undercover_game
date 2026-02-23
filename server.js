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
  { civilian: "Shonen", undercover: "Seinen" },
  { civilian: "Hokage", undercover: "Empereur" },
  { civilian: "Super Saiyan", undercover: "Gear Second" },
  { civilian: "Bankai", undercover: "Rasengan" },
  { civilian: "Satoru Gojo", undercover: "Kakashi Hatake" },
  { civilian: "L (Death Note)", undercover: "Light Yagami" },
  { civilian: "Naruto", undercover: "Boruto" },
  { civilian: "One Piece", undercover: "Fairy Tail" },
  { civilian: "My Hero Academia", undercover: "One Punch Man" },
  { civilian: "Eren Jäger", undercover: "Ken Kaneki" },
  { civilian: "Mangaka", undercover: "Animateur" },
  { civilian: "Death Note", undercover: "Code Geass" },
  { civilian: "Jujutsu Kaisen", undercover: "Demon Slayer" },

  // ─── RAP FR ────────────────────────────────────
  { civilian: "Booba", undercover: "Rohff" },
  { civilian: "PNL", undercover: "Djadja & Dinaz" },
  { civilian: "Ninho", undercover: "Jul" },
  { civilian: "Nekfeu", undercover: "Orelsan" },
  { civilian: "Gazo", undercover: "Tiakola" },
  { civilian: "Damso", undercover: "Hamza" },
  { civilian: "Planète Rap", undercover: "Colors" },
  { civilian: "Autotune", undercover: "Vocoder" },
  { civilian: "Freestyle", undercover: "Clash" },
  { civilian: "Boom Bap", undercover: "Drill" },
  { civilian: "Beatmaker", undercover: "Producteur" },
  { civilian: "Disque d'Or", undercover: "Disque de Platine" },
  { civilian: "Bercy", undercover: "Stade de France" },
  { civilian: "Werenoi", undercover: "SDM" },
  { civilian: "13 Organisé", undercover: "Classico Organisé" },

  // ─── FOOTBALL ──────────────────────────────────
  { civilian: "Ballon d'Or", undercover: "Soulier d'Or" },
  { civilian: "Ligue des Champions", undercover: "Europa League" },
  { civilian: "Penalty", undercover: "Coup franc" },
  { civilian: "Hors-jeu", undercover: "Faute" },
  { civilian: "VAR", undercover: "Arbitre de touche" },
  { civilian: "PSG", undercover: "Olympique de Marseille" },
  { civilian: "Real Madrid", undercover: "FC Barcelone" },
  { civilian: "Messi", undercover: "Cristiano Ronaldo" },
  { civilian: "Mbappé", undercover: "Haaland" },
  { civilian: "Guardiola", undercover: "Mourinho" },
  { civilian: "Zidane", undercover: "Platini" },
  { civilian: "Attaquant", undercover: "Ailier" },
  { civilian: "Milieu défensif", undercover: "Défenseur central" },
  { civilian: "Crampons", undercover: "Protège-tibias" },
  { civilian: "Carton jaune", undercover: "Carton rouge" },
  { civilian: "Coupe du Monde", undercover: "Euro" },
  { civilian: "Juventus", undercover: "AC Milan" },
  { civilian: "Arsenal", undercover: "Chelsea" },
  { civilian: "Dribble", undercover: "Tacle" },
  { civilian: "Premier League", undercover: "Liga" },

  // ─── POLITIQUE ─────────────────────────────────
  { civilian: "Assemblée Nationale", undercover: "Sénat" },
  { civilian: "Député", undercover: "Sénateur" },
  { civilian: "Premier Ministre", undercover: "Président de la République" },
  { civilian: "Élysée", undercover: "Matignon" },
  { civilian: "49.3", undercover: "Motion de censure" },
  { civilian: "Gauche", undercover: "Droite" },
  { civilian: "Capitalisme", undercover: "Libéralisme" },
  { civilian: "Constitution", undercover: "Loi" },
  { civilian: "Référendum", undercover: "Élection" },
  { civilian: "Maire", undercover: "Préfet" },
  { civilian: "Ministre", undercover: "Secrétaire d'État" },
  { civilian: "Syndicat", undercover: "Patronat" },
  { civilian: "Démocratie", undercover: "République" },
  { civilian: "ONU", undercover: "OTAN" },
  { civilian: "Emmanuel Macron", undercover: "François Hollande" },

  // ─── ANIMAUX (Pièges classiques) ───────────────
  { civilian: "Pingouin", undercover: "Manchot" },
  { civilian: "Chouette", undercover: "Hibou" },
  { civilian: "Crocodile", undercover: "Alligator" },
  { civilian: "Dromadaire", undercover: "Chameau" },
  { civilian: "Guépard", undercover: "Léopard" },
  { civilian: "Crapaud", undercover: "Grenouille" },
  { civilian: "Abeille", undercover: "Guêpe" },
  { civilian: "Lièvre", undercover: "Lapin" },
  { civilian: "Corbeau", undercover: "Corneille" },
  { civilian: "Dauphin", undercover: "Marsouin" },

  // ─── NOURRITURE & GASTRONOMIE ──────────────────
  { civilian: "Brie", undercover: "Camembert" },
  { civilian: "Macaron", undercover: "Meringue" },
  { civilian: "Coriandre", undercover: "Persil" },
  { civilian: "Clémentine", undercover: "Mandarine" },
  { civilian: "Champagne", undercover: "Prosecco" },
  { civilian: "Kebab", undercover: "Tacos" },
  { civilian: "Beurre", undercover: "Margarine" },
  { civilian: "Sushi", undercover: "Maki" },
  { civilian: "Saumon", undercover: "Truite" },
  { civilian: "Crêpe", undercover: "Gaufre" },

  // ─── GÉOGRAPHIE & LIEUX ────────────────────────
  { civilian: "Océan", undercover: "Mer" },
  { civilian: "Fleuve", undercover: "Rivière" },
  { civilian: "Pôle Nord", undercover: "Pôle Sud" },
  { civilian: "Everest", undercover: "Mont Blanc" },
  { civilian: "Sahara", undercover: "Gobi" },
  { civilian: "Tokyo", undercover: "Kyoto" },
  { civilian: "New York", undercover: "Los Angeles" },
  { civilian: "Île", undercover: "Presqu'île" },
  { civilian: "Capitale", undercover: "Métropole" },
  { civilian: "Brésil", undercover: "Argentine" },

  // ─── OBJETS & QUOTIDIEN ────────────────────────
  { civilian: "Parfum", undercover: "Eau de toilette" },
  { civilian: "Couette", undercover: "Couverture" },
  { civilian: "Gant", undercover: "Moufle" },
  { civilian: "Horloge", undercover: "Montre" },
  { civilian: "Savon", undercover: "Gel douche" },
  { civilian: "Balai", undercover: "Aspirateur" },
  { civilian: "Miroir", undercover: "Vitre" },
  { civilian: "Stylo", undercover: "Crayon" },
  { civilian: "Livre", undercover: "Magazine" },
  { civilian: "Chaussure", undercover: "Botte" },

  // ─── CULTURE POP & ARTS ────────────────────────
  { civilian: "Marvel", undercover: "DC Comics" },
  { civilian: "Star Wars", undercover: "Star Trek" },
  { civilian: "Seigneur des Anneaux", undercover: "Harry Potter" },
  { civilian: "Netflix", undercover: "Amazon Prime" },
  { civilian: "Oscars", undercover: "César" },
  { civilian: "Peinture", undercover: "Sculpture" },
  { civilian: "Piano", undercover: "Clavier" },
  { civilian: "Roman", undercover: "Nouvelle" },
  { civilian: "Magie", undercover: "Illusion" },
  { civilian: "Batterie", undercover: "Percussions" },

  // ─── SCIENCE & NATURE ──────────────────────────
  { civilian: "Tornade", undercover: "Ouragan" },
  { civilian: "Étoile", undercover: "Planète" },
  { civilian: "Météorite", undercover: "Astéroïde" },
  { civilian: "ADN", undercover: "ARN" },
  { civilian: "Virus", undercover: "Bactérie" },
  { civilian: "Atome", undercover: "Molécule" },
  { civilian: "Tremblement de terre", undercover: "Tsunami" },
  { civilian: "Nuage", undercover: "Brouillard" },
  { civilian: "Gravité", undercover: "Magnétisme" },
  { civilian: "Neige", undercover: "Grêle" },

  // ─── MÉTIERS ───────────────────────────────────
  { civilian: "Boulanger", undercover: "Pâtissier" },
  { civilian: "Pompier", undercover: "Policier" },
  { civilian: "Avocat", undercover: "Juge" },
  { civilian: "Architecte", undercover: "Ingénieur" },
  { civilian: "Acteur", undercover: "Réalisateur" },
  { civilian: "Dentiste", undercover: "Orthodontiste" },
  { civilian: "Journaliste", undercover: "Chroniqueur" },
  { civilian: "Plombier", undercover: "Électricien" },
  { civilian: "Chirurgien", undercover: "Médecin" },
  { civilian: "Pilote", undercover: "Chauffeur" },

  // ─── TECHNOLOGIE & WEB ─────────────────────────
  { civilian: "Google", undercover: "ChatGPT" },
  { civilian: "iPhone", undercover: "Samsung Galaxy" },
  { civilian: "Instagram", undercover: "TikTok" },
  { civilian: "Twitter", undercover: "Threads" },
  { civilian: "Python", undercover: "JavaScript" },
  { civilian: "Bitcoin", undercover: "Ethereum" },
  { civilian: "Hacker", undercover: "Virus" },
  { civilian: "Fibre optique", undercover: "4G / 5G" },
  { civilian: "Wifi", undercover: "Bluetooth" },
  { civilian: "Souris", undercover: "Clavier" },
  { civilian: "Crêpe", undercover: "Pancake" }, // Les deux sont plats, ronds, sucrés/salés
  { civilian: "Glace", undercover: "Sorbet" }, // Froid, dessert, parfum fruit
  { civilian: "Croissant", undercover: "Pain au chocolat" }, // Boulangerie, matin, beurre
  { civilian: "Frites", undercover: "Potatoes" }, // Patate, fast-food, frit
  { civilian: "Mayonnaise", undercover: "Moutarde" }, // Condiment, jaune, pot
  { civilian: "Raclette", undercover: "Fondue" }, // Fromage fondu, hiver, convivial
  { civilian: "Saucisson", undercover: "Chorizo" }, // Charcuterie, apéro, tranches

  // -- Quotidien & Maison --
  { civilian: "Douche", undercover: "Bain" }, // Laver, eau, salle de bain, chaud
  { civilian: "Canapé", undercover: "Fauteuil" }, // S'asseoir, salon, coussin
  { civilian: "Couette", undercover: "Plaid" }, // Chaud, lit/canapé, dormir
  { civilian: "Escalier", undercover: "Escalator" }, // Monter, descendre, marches
  { civilian: "Montre", undercover: "Réveil" }, // Heure, matin, poignet/table
  { civilian: "Livre", undercover: "Liseuse" }, // Lire, pages, histoire
  { civilian: "Parapluie", undercover: "K-Way" }, // Pluie, se protéger, extérieur

  // -- Transports & Lieux --
  { civilian: "Hôtel", undercover: "Airbnb" }, // Dormir, voyage, location
  { civilian: "Gare", undercover: "Aéroport" }, // Départ, voyage, valise, billets
  { civilian: "Train", undercover: "Métro" }, // Rails, transport, rames
  { civilian: "Autoroute", undercover: "Périphérique" }, // Voitures, vite, bouchons
  { civilian: "Supermarché", undercover: "Marché" }, // Courses, caddie, fruits

  // -- Tech & Réseaux Sociaux --
  { civilian: "SMS", undercover: "WhatsApp" }, // Message, téléphone, écrire
  { civilian: "Story", undercover: "Réel" }, // Instagram, vidéo courte, 24h
  { civilian: "Spotify", undercover: "Deezer" }, // Musique, playlist, écouteurs
  { civilian: "PlayStation", undercover: "Xbox" }, // Console, manette, jeux
  { civilian: "Clavier", undercover: "Souris" }, // Ordinateur, taper, clic

  // -- Corps & Vêtements --
  { civilian: "Manteau", undercover: "Doudoune" }, // Hiver, chaud, fermer
  { civilian: "Lunettes", undercover: "Lentilles" }, // Yeux, voir, myope
  { civilian: "Barbe", undercover: "Moustache" }, // Poils, visage, raser
  { civilian: "Casquette", undercover: "Bonnet" }, // Tête, cheveux, cacher

  // -- Pop-Culture & Divertissement --
  { civilian: "Série TV", undercover: "Film" }, // Regarder, écran, acteurs
  { civilian: "Concert", undercover: "Festival" }, // Musique, public, scène, debout
  { civilian: "Disney", undercover: "Pixar" }, // Dessin animé, enfance, cinéma
  { civilian: "Mario", undercover: "Luigi" }, // Moustache, jeu vidéo, Nintendo
  { civilian: "Batman", undercover: "Superman" }, // Super-héros, cape, comics
  { civilian: "Baguette magique", undercover: "Balai volant" }, // Sorciers, Harry Potter, bois

  // -- Sport & Nature --
  { civilian: "Marathon", undercover: "Sprint" }, // Courir, course, athlétisme
  { civilian: "Musculation", undercover: "Crossfit" }, // Sport, salle, poids, sueur
  { civilian: "Natation", undercover: "Plongée" }, // Eau, piscine/mer, respiration
  { civilian: "Orage", undercover: "Tempête" }, // Ciel, météo, vent, pluie
  { civilian: "Forêt", undercover: "Jungle" }, // Arbres, nature, animaux, vert
  { civilian: "Lac", undercover: "Océan" } // Eau, nager, profond
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
  // Compter les votes
  const tally = {};
  lobby.players.forEach(p => { tally[p.id] = 0; });
  Object.values(lobby.votes).forEach(targetId => {
    tally[targetId] = (tally[targetId] || 0) + 1;
  });

  const imposteurPlayer = lobby.players.find(p => p.role === 'undercover' || p.role === 'mrwhite');
  const imposteurId = imposteurPlayer?.id;

  // Trouver le joueur le plus voté et détecter les égalités
  let maxVotes = 0;
  Object.values(tally).forEach(count => { if (count > maxVotes) maxVotes = count; });
  const mostVotedIds = Object.entries(tally).filter(([,count]) => count === maxVotes).map(([id]) => id);
  const isTie = mostVotedIds.length > 1;
  const mostVotedId = isTie ? null : mostVotedIds[0]; // null si égalité

  const imposteurVotes = tally[imposteurId] || 0;
  const scoreDetails = []; // pour le client

  // ── SCORING INDIVIDUEL ────────────────────────────────────────────────────

  lobby.players.forEach(p => {
    if (p.role === 'civilian') {
      // Chaque civil qui a voté pour l'imposteur gagne 100 pts
      const votedFor = lobby.votes[p.id];
      if (votedFor === imposteurId) {
        p.score = (p.score || 0) + 100;
        scoreDetails.push({ playerId: p.id, reason: 'vote_correct', points: 100 });
      }
      // Bonus civil : l'imposteur est désigné majoritairement (sans égalité)
      if (!isTie && mostVotedId === imposteurId) {
        p.score = (p.score || 0) + 50;
        scoreDetails.push({ playerId: p.id, reason: 'bonus_imposteur_elimine', points: 50 });
      }
    }

    if (p.id === imposteurId) {
      // L'imposteur gagne 100 pts pour chaque civil qui ne l'a pas voté
      const votesContreImposteur = imposteurVotes;
      const votesNonContre = lobby.players.length - 1 - votesContreImposteur; // -1 car il ne vote pas pour lui-même
      const pts = votesNonContre * 100;
      if (pts > 0) {
        p.score = (p.score || 0) + pts;
        scoreDetails.push({ playerId: p.id, reason: 'votes_non_contre', points: pts });
      }
      // Bonus imposteur : vote majoritaire vers un civil (sans égalité)
      if (!isTie && mostVotedId !== imposteurId) {
        p.score = (p.score || 0) + 50;
        scoreDetails.push({ playerId: p.id, reason: 'bonus_civil_elimine', points: 50 });
      }
    }
  });

  // Déterminer le résultat pour l'affichage
  const imposteurDesigne = !isTie && mostVotedId === imposteurId;
  const roundResult = {
    tally,
    isTie,
    mostVotedId,
    imposteurId,
    imposteurDesigne,
    scoreDetails,
    mrWhiteEliminated: imposteurDesigne && imposteurPlayer?.role === 'mrwhite',
  };

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
      if (currentId !== playerId && lobby.host !== playerId)
 return;
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