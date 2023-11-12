require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Game, Team, Player,Session } = require('./controllers');
const cors = require('cors');  
const crypto = require('crypto');
const app = express();
const path = require('path');
const mongoose = require('mongoose');


const fs = require('fs');
const config = {
    DB: process.env.MONGODB_URI
        //DB: process.env.MONGODB_URI || 'mongodb://localhost/tsuapp'
}
let pngFiles = [];
const PORT = process.env.PORT || 3030;
fs.readdir("./images", (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    
   
     pngFiles = files.filter(file => file.endsWith('.png'));
    
   
  });


  mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {
        console.log('Database is connected');
    },
    (err) => {
        console.log('Can not connect to the database' + err);
    }
);



function createUniqueId() {
    const timestamp = new Date().getTime().toString(16);  
    const randomPart = Math.floor(Math.random() * 1000000).toString(16); 
    const data =`${timestamp}-${randomPart}`;
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}
const memory = {
    sessions: [],

};

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.post('/api/create_session', (req, res) => {
    console.log(req.body)
    const sessionId = createUniqueId();
    const session = new Session(sessionId, req.body.userid, req.body.title);
 
    memory.sessions.push(session);

  res.json({ message: 'Game hosted successfully!', sessionId });
});

app.get('/join/:gameId/:teamName/:playerName', (req, res) => {
  const gameId = parseInt(req.params.gameId);
  const teamName = req.params.teamName;
  const playerName = req.params.playerName;

  
  const game = gameData.games.find((g) => g.id === gameId);

  if (game) {
    
    let team = game.teams.find((t) => t.name === teamName);
    if (!team) {
      
      team = new Team(teamName);
      game.addTeam(team);
    }

    
    const player = new Player(game.teams.length * 10 + team.players.length + 1, playerName, teamName);
    team.addPlayer(player);

    res.json({ message: `${playerName} joined team ${teamName} in Game ${gameId} successfully!` });
  } else {
    res.status(404).json({ message: 'Game not found!' });
  }
});
app.post('/join_session/:sessionId', (req, res) => {
    const {userId} = req.body
})
app.post('/game/:gameId/buzz', (req, res) => {
  const gameId = parseInt(req.params.gameId);
  const teamName = req.body.teamName;
  const playerName = req.body.playerName;

  
  const game = gameData.games.find((g) => g.id === gameId);

  if (game) {
    
    const player = game.teams
      .flatMap((team) => team.players)
      .find((p) => p.name === playerName && p.team === teamName);

    if (player) {
      
      game.handleBuzz(player);

      res.json({ message: `${playerName} from ${teamName} buzzed in Game ${gameId}!` });
    } else {
      res.status(404).json({ message: 'Player not found!' });
    }
  } else {
    res.status(404).json({ message: 'Game not found!' });
  }
});

app.get('/game/:gameId', (req, res) => {
  const gameId = parseInt(req.params.gameId);

  
  const game = gameData.games.find((g) => g.id === gameId);

  if (game) {
    const gameDetails = {
      teams: game.teams,
      buzzOrder: game.buzzOrder,
      currentQuestion: game.currentQuestion,
    };
    res.json(gameDetails);
  } else {
    res.status(404).json({ message: 'Game not found!' });
  }
});
app.get('/images', (req, res) => {
    

    res.json({ images: pngFiles });
  });
app.use('/public', express.static('./images'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
