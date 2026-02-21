# 🎮 UNDERCOVER — Jeu de l'imposteur en temps réel

## Installation & Lancement

### Prérequis
- **Node.js** (v14+) — https://nodejs.org
- Aucune dépendance npm !

### Démarrer le serveur
```bash
node server.js
```
Le serveur tourne sur **http://localhost:3000**

### Jouer en réseau local (Wi-Fi)
1. Lancez le serveur sur votre PC/Mac
2. Trouvez votre IP locale : 
   - Windows : `ipconfig` → cherchez "Adresse IPv4"
   - Mac/Linux : `ifconfig` → cherchez `inet`
3. Les autres joueurs accèdent à : `http://192.168.x.x:3000`

### Jouer depuis Internet (optionnel)
Déployez sur Railway, Render, ou Heroku :
- Uploadez server.js + index.html
- Définissez la variable `PORT` (automatique sur ces plateformes)

---

## 🎯 Règles du jeu

- **3 à 6 joueurs** se connectent au même lobby
- Chacun reçoit un mot (sauf Mr. White si activé)
- L'imposteur a un mot **similaire** mais différent
- À chaque tour, les joueurs donnent un **indice en 1 mot**
- Après les tours : **vote public** pour éliminer l'imposteur

### Points
- Civils trouvent l'imposteur : **+100 pts** chacun
- Imposteur survit : **+100 pts** × nombre de votes non contre lui
- Mr. White éliminé + devine le mot : **+200 pts** bonus

---

## ⚙️ Paramètres configurables
- Nombre de manches (1-10)
- Tours par manche (1-5)
- Temps par tour en secondes (0 = illimité)
- Mode Mr. White (on/off)
- Liste de mots modifiable par l'hôte en temps réel

---

## 📁 Structure
```
undercover/
├── server.js    — Serveur WebSocket + HTTP (Node.js natif)
└── index.html   — Frontend complet
```
