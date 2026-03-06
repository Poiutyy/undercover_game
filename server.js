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
  { civilian: "Cinéma", undercover: "Théâtre" },{ civilian: "Lion", undercover: "Tigre" },
  { civilian: "Chat", undercover: "Chien" },
  { civilian: "Loup", undercover: "Renard" },
  { civilian: "Souris", undercover: "Rat" },
  { civilian: "Lapin", undercover: "Lièvre" },
  { civilian: "Cheval", undercover: "Poney" },
  { civilian: "Aigle", undercover: "Faucon" },
  { civilian: "Requin", undercover: "Dauphin" },
  { civilian: "Baleine", undercover: "Orque" },
  { civilian: "Araignée", undercover: "Scorpion" },
  { civilian: "Vache", undercover: "Taureau" },
  { civilian: "Poule", undercover: "Coq" },
  { civilian: "Hibou", undercover: "Chouette" },
  { civilian: "Singe", undercover: "Gorille" },
  { civilian: "Ours", undercover: "Panda" },
  { civilian: "Mouche", undercover: "Moustique" },
  { civilian: "Abeille", undercover: "Guêpe" },
  { civilian: "Papillon", undercover: "Phalène" },
  { civilian: "Fourmi", undercover: "Termite" },
  { civilian: "Crocodile", undercover: "Alligator" },
  { civilian: "Grenouille", undercover: "Crapaud" },
  { civilian: "Serpent", undercover: "Lézard" },
  { civilian: "Tortue", undercover: "Escargot" },
  { civilian: "Pingouin", undercover: "Manchot" },
  { civilian: "Éléphant", undercover: "Rhinocéros" },
  { civilian: "Girafe", undercover: "Zèbre" },
  { civilian: "Chameau", undercover: "Dromadaire" },
  { civilian: "Mouton", undercover: "Chèvre" },
  { civilian: "Cochon", undercover: "Sanglier" },
  { civilian: "Corbeau", undercover: "Pigeon" },
  { civilian: "Canard", undercover: "Oie" },
  { civilian: "Cerf", undercover: "Chevreuil" },
  { civilian: "Panthère", undercover: "Léopard" },
  { civilian: "Phoque", undercover: "Otarie" },
  { civilian: "Kangourou", undercover: "Koala" },
  { civilian: "Hérisson", undercover: "Porc-épic" },
  { civilian: "Guépard", undercover: "Jaguar" },
  { civilian: "Chauve-souris", undercover: "Oiseau" },
  { civilian: "Castor", undercover: "Loutre" },
  { civilian: "Hamster", undercover: "Cochon d'Inde" },

  // 🌍 Géographie & Nature (40 paires)
  { civilian: "Paris", undercover: "Londres" },
  { civilian: "France", undercover: "Espagne" },
  { civilian: "Mer", undercover: "Océan" },
  { civilian: "Montagne", undercover: "Colline" },
  { civilian: "Fleuve", undercover: "Rivière" },
  { civilian: "Désert", undercover: "Jungle" },
  { civilian: "Plage", undercover: "Piscine" },
  { civilian: "Soleil", undercover: "Lune" },
  { civilian: "Étoile", undercover: "Planète" },
  { civilian: "Terre", undercover: "Mars" },
  { civilian: "Afrique", undercover: "Asie" },
  { civilian: "Europe", undercover: "Amérique" },
  { civilian: "États-Unis", undercover: "Canada" },
  { civilian: "Tokyo", undercover: "Pékin" },
  { civilian: "Rome", undercover: "Venise" },
  { civilian: "Neige", undercover: "Glace" },
  { civilian: "Pluie", undercover: "Grêle" },
  { civilian: "Vent", undercover: "Tempête" },
  { civilian: "Arbre", undercover: "Fleur" },
  { civilian: "Forêt", undercover: "Bois" },
  { civilian: "Grotte", undercover: "Caverne" },
  { civilian: "Île", undercover: "Presqu'île" },
  { civilian: "Lac", undercover: "Étang" },
  { civilian: "Volcan", undercover: "Cratère" },
  { civilian: "Nord", undercover: "Sud" },
  { civilian: "Est", undercover: "Ouest" },
  { civilian: "Ciel", undercover: "Nuage" },
  { civilian: "Sable", undercover: "Terre" },
  { civilian: "Pierre", undercover: "Rocher" },
  { civilian: "Feu", undercover: "Eau" },
  { civilian: "Jour", undercover: "Nuit" },
  { civilian: "Matin", undercover: "Soir" },
  { civilian: "Été", undercover: "Hiver" },
  { civilian: "Printemps", undercover: "Automne" },
  { civilian: "Campagne", undercover: "Ville" },
  { civilian: "Village", undercover: "Capitale" },
  { civilian: "Route", undercover: "Chemin" },
  { civilian: "Pont", undercover: "Tunnel" },
  { civilian: "Carte", undercover: "Boussole" },
  { civilian: "Monde", undercover: "Univers" },

  // 🍔 Nourriture & Fruits (40 paires)
  { civilian: "Pomme", undercover: "Poire" },
  { civilian: "Fraise", undercover: "Framboise" },
  { civilian: "Banane", undercover: "Ananas" },
  { civilian: "Citron", undercover: "Orange" },
  { civilian: "Pêche", undercover: "Abricot" },
  { civilian: "Raisin", undercover: "Cerise" },
  { civilian: "Melon", undercover: "Pastèque" },
  { civilian: "Tomate", undercover: "Poivron" },
  { civilian: "Carotte", undercover: "Pomme de terre" },
  { civilian: "Oignon", undercover: "Ail" },
  { civilian: "Salade", undercover: "Chou" },
  { civilian: "Brocoli", undercover: "Chou-fleur" },
  { civilian: "Courgette", undercover: "Aubergine" },
  { civilian: "Riz", undercover: "Pâtes" },
  { civilian: "Pain", undercover: "Baguette" },
  { civilian: "Beurre", undercover: "Fromage" },
  { civilian: "Lait", undercover: "Crème" },
  { civilian: "Œuf", undercover: "Omelette" },
  { civilian: "Viande", undercover: "Poisson" },
  { civilian: "Poulet", undercover: "Bœuf" },
  { civilian: "Saucisse", undercover: "Merguez" },
  { civilian: "Gâteau", undercover: "Tarte" },
  { civilian: "Crêpe", undercover: "Gaufre" },
  { civilian: "Chocolat", undercover: "Vanille" },
  { civilian: "Sucre", undercover: "Sel" },
  { civilian: "Poivre", undercover: "Moutarde" },
  { civilian: "Ketchup", undercover: "Mayonnaise" },
  { civilian: "Eau", undercover: "Jus" },
  { civilian: "Café", undercover: "Thé" },
  { civilian: "Bière", undercover: "Vin" },
  { civilian: "Coca", undercover: "Pepsi" },
  { civilian: "Glace", undercover: "Sorbet" },
  { civilian: "Bonbon", undercover: "Chewing-gum" },
  { civilian: "Confiture", undercover: "Miel" },
  { civilian: "Croissant", undercover: "Pain au chocolat" },
  { civilian: "Burger", undercover: "Pizza" },
  { civilian: "Frites", undercover: "Chips" },
  { civilian: "Sandwich", undercover: "Tacos" },
  { civilian: "Soupe", undercover: "Velouté" },
  { civilian: "Noix", undercover: "Cacahuète" },

  // ⚔️ Anime & Manga (30 paires)
  { civilian: "Naruto", undercover: "Sasuke" },
  { civilian: "Goku", undercover: "Vegeta" },
  { civilian: "Luffy", undercover: "Zoro" },
  { civilian: "Ninja", undercover: "Samouraï" },
  { civilian: "Manga", undercover: "Comics" },
  { civilian: "Anime", undercover: "Dessin animé" },
  { civilian: "Pokémon", undercover: "Digimon" },
  { civilian: "Pikachu", undercover: "Dracaufeu" },
  { civilian: "Titan", undercover: "Goule" },
  { civilian: "Hokage", undercover: "Empereur" },
  { civilian: "Kunai", undercover: "Shuriken" },
  { civilian: "Dragon Ball", undercover: "One Piece" },
  { civilian: "Itachi", undercover: "Sasuke" },
  { civilian: "Super Saiyan", undercover: "Bankai" },
  { civilian: "Sharingan", undercover: "Byakugan" },
  { civilian: "Shinigami", undercover: "Démon" },
  { civilian: "Pirate", undercover: "Marine" },
  { civilian: "Chakra", undercover: "Magie" },
  { civilian: "Épée", undercover: "Katana" },
  { civilian: "Gohan", undercover: "Trunks" },
  { civilian: "Sailor Moon", undercover: "Sakura" },
  { civilian: "My Hero Academia", undercover: "Demon Slayer" },
  { civilian: "Deku", undercover: "Bakugo" },
  { civilian: "Death Note", undercover: "Code Geass" },
  { civilian: "L", undercover: "Light" },
  { civilian: "Hunter x Hunter", undercover: "Bleach" },
  { civilian: "Gon", undercover: "Killua" },
  { civilian: "Alchimiste", undercover: "Sorcier" },
  { civilian: "Studio Ghibli", undercover: "Disney" },
  { civilian: "Totoro", undercover: "Ponyo" },

  // 🎬 Films & Pop Culture (30 paires)
  { civilian: "Film", undercover: "Série" },
  { civilian: "Acteur", undercover: "Réalisateur" },
  { civilian: "Cinéma", undercover: "Télévision" },
  { civilian: "Comédie", undercover: "Drame" },
  { civilian: "Horreur", undercover: "Thriller" },
  { civilian: "Science-fiction", undercover: "Fantasy" },
  { civilian: "Marvel", undercover: "DC" },
  { civilian: "Batman", undercover: "Superman" },
  { civilian: "Spiderman", undercover: "Iron Man" },
  { civilian: "Avengers", undercover: "Justice League" },
  { civilian: "Harry Potter", undercover: "Seigneur des Anneaux" },
  { civilian: "Sorcier", undercover: "Magicien" },
  { civilian: "Jedi", undercover: "Sith" },
  { civilian: "Sabre laser", undercover: "Baguette magique" },
  { civilian: "Star Wars", undercover: "Star Trek" },
  { civilian: "Zombie", undercover: "Vampire" },
  { civilian: "Loup-garou", undercover: "Fantôme" },
  { civilian: "Disney", undercover: "Pixar" },
  { civilian: "Mickey", undercover: "Donald" },
  { civilian: "Shrek", undercover: "L'Âge de Glace" },
  { civilian: "Netflix", undercover: "Amazon Prime" },
  { civilian: "Oscar", undercover: "César" },
  { civilian: "Caméra", undercover: "Micro" },
  { civilian: "Action", undercover: "Aventure" },
  { civilian: "Héros", undercover: "Vilain" },
  { civilian: "Prince", undercover: "Princesse" },
  { civilian: "Reine", undercover: "Roi" },
  { civilian: "Chevalier", undercover: "Garde" },
  { civilian: "Dragon", undercover: "Dinosaure" },
  { civilian: "James Bond", undercover: "Mission Impossible" },

  // 📱 Objets du quotidien & Transports (40 paires)
  { civilian: "Voiture", undercover: "Moto" },
  { civilian: "Vélo", undercover: "Trottinette" },
  { civilian: "Avion", undercover: "Hélicoptère" },
  { civilian: "Train", undercover: "Métro" },
  { civilian: "Bus", undercover: "Tramway" },
  { civilian: "Bateau", undercover: "Navire" },
  { civilian: "Camion", undercover: "Fourgonnette" },
  { civilian: "Chaussure", undercover: "Chaussette" },
  { civilian: "Pantalon", undercover: "Short" },
  { civilian: "T-shirt", undercover: "Pull" },
  { civilian: "Veste", undercover: "Manteau" },
  { civilian: "Chapeau", undercover: "Casquette" },
  { civilian: "Lunettes", undercover: "Lentilles" },
  { civilian: "Montre", undercover: "Bracelet" },
  { civilian: "Bague", undercover: "Collier" },
  { civilian: "Téléphone", undercover: "Tablette" },
  { civilian: "Ordinateur", undercover: "Télévision" },
  { civilian: "Clavier", undercover: "Souris" },
  { civilian: "Stylo", undercover: "Crayon" },
  { civilian: "Cahier", undercover: "Livre" },
  { civilian: "Sac", undercover: "Valise" },
  { civilian: "Lit", undercover: "Canapé" },
  { civilian: "Chaise", undercover: "Fauteuil" },
  { civilian: "Table", undercover: "Bureau" },
  { civilian: "Porte", undercover: "Fenêtre" },
  { civilian: "Clé", undercover: "Serrure" },
  { civilian: "Assiette", undercover: "Verre" },
  { civilian: "Fourchette", undercover: "Cuillère" },
  { civilian: "Couteau", undercover: "Ciseaux" },
  { civilian: "Savon", undercover: "Shampooing" },
  { civilian: "Brosse", undercover: "Peigne" },
  { civilian: "Dentifrice", undercover: "Brosse à dents" },
  { civilian: "Serviette", undercover: "Gant de toilette" },
  { civilian: "Miroir", undercover: "Vitre" },
  { civilian: "Lampe", undercover: "Ampoule" },
  { civilian: "Allumette", undercover: "Briquet" },
  { civilian: "Poubelle", undercover: "Balai" },
  { civilian: "Horloge", undercover: "Réveil" },
  { civilian: "Portefeuille", undercover: "Porte-monnaie" },
  { civilian: "Argent", undercover: "Carte bancaire" },

  // ⚽ Métiers & Sports (30 paires)
  { civilian: "Médecin", undercover: "Infirmier" },
  { civilian: "Pompier", undercover: "Policier" },
  { civilian: "Professeur", undercover: "Élève" },
  { civilian: "Boulanger", undercover: "Boucher" },
  { civilian: "Cuisinier", undercover: "Serveur" },
  { civilian: "Chanteur", undercover: "Danseur" },
  { civilian: "Agriculteur", undercover: "Éleveur" },
  { civilian: "Avocat", undercover: "Juge" },
  { civilian: "Pilote", undercover: "Chauffeur" },
  { civilian: "Astronaute", undercover: "Scientifique" },
  { civilian: "Écrivain", undercover: "Journaliste" },
  { civilian: "Coiffeur", undercover: "Esthéticienne" },
  { civilian: "Peintre", undercover: "Sculpteur" },
  { civilian: "Mécanicien", undercover: "Plombier" },
  { civilian: "Architecte", undercover: "Ingénieur" },
  { civilian: "Football", undercover: "Rugby" },
  { civilian: "Basketball", undercover: "Handball" },
  { civilian: "Tennis", undercover: "Ping-pong" },
  { civilian: "Natation", undercover: "Plongeon" },
  { civilian: "Course", undercover: "Marche" },
  { civilian: "Boxe", undercover: "Karaté" },
  { civilian: "Judo", undercover: "Lutte" },
  { civilian: "Ski", undercover: "Snowboard" },
  { civilian: "Surf", undercover: "Planche à voile" },
  { civilian: "Gymnastique", undercover: "Danse" },
  { civilian: "Cyclisme", undercover: "Athlétisme" },
  { civilian: "Équitation", undercover: "Polo" },
  { civilian: "Golf", undercover: "Mini-golf" },
  { civilian: "Billard", undercover: "Bowling" },
  { civilian: "Arbitre", undercover: "Joueur" }
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
  const mrWhiteInGame = imposteurPlayer?.role === 'mrwhite';
  // Mr White peut toujours deviner, quelle que soit l'issue du vote
  const mrWhiteCanGuess = mrWhiteInGame;
  const roundResult = {
    tally,
    isTie,
    mostVotedId,
    imposteurId,
    imposteurDesigne,
    scoreDetails,
    mrWhiteCanGuess,
    mrWhiteEliminated: imposteurDesigne && mrWhiteInGame, // gardé pour compat
  };

  lobby.state = 'roundEnd';
  lobby.lastRoundResult = roundResult; // pour mrWhiteGuess
  // Ne pas envoyer wordPair si Mr White doit encore deviner (évite la fuite du mot)
  broadcast(lobby, {
    type: 'roundEnd',
    roundResult,
    wordPair: roundResult.mrWhiteCanGuess ? null : lobby.wordPair,
    state: getLobbyPublicState(lobby),
  });

  // Si Mr White joue, on attend sa devinette avant de potentiellement terminer
  // La fin de partie sera déclenchée par nextRound (hôte) ou après mrWhiteGuess
  if (lobby.currentRound >= lobby.settings.rounds && !mrWhiteCanGuess) {
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
      lobby.mrWhiteGuess = msg.guess;
      const civilianWord = lobby.wordPair?.civilian;
      const correct = msg.guess?.toLowerCase().trim() === civilianWord?.toLowerCase().trim();
      const mrWhiteId = lobby.players.find(p => p.role === 'mrwhite')?.id;
      const wasEliminated = mrWhiteId && lobby.lastRoundResult?.mostVotedId === mrWhiteId && !lobby.lastRoundResult?.isTie;
      if (correct) {
        const mw = lobby.players.find(p => p.role === 'mrwhite');
        // 250 pts si démasqué et devine, 50 pts si survit et devine
        const bonus = wasEliminated ? 250 : 50;
        if (mw) mw.score = (mw.score || 0) + bonus;
      }
      const isLastRound = lobby.currentRound >= lobby.settings.rounds;
      broadcast(lobby, { type: 'mrWhiteGuessResult', guess: msg.guess, correct, civilianWord, wasEliminated, isLastRound, wordPair: lobby.wordPair, state: getLobbyPublicState(lobby) });
      // Ne pas auto-terminer — l'hôte clique sur le bouton final
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
