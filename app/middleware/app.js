require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Game, Team, Player,Session } = require('./controllers');
const cors = require('cors');  
const crypto = require('crypto');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { randomBytes } = require('crypto');

const fs = require('fs');
const SessionModel = require('./models/session.model');
const userModel = require('./models/user.model');
const SessionUserModel = require('./models/session.user.model');
const questionModel = require('./models/questions.model');
const config = {
    DB: process.env.MONGODB
      
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


  function generateUID(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = randomBytes(length);
    let uid = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = bytes[i] % characters.length;
      uid += characters.charAt(randomIndex);
    }
  
      return uid;
  }

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
async function getUserSessionsAndTeams(sessionid) {
    try {
      const userSessions = await SessionUserModel.find({
        sessionid: sessionid
      });
      const teamHashMap = {};
  
      userSessions.forEach(session => {
        const { team } = session;
        
        if (!teamHashMap[team]) {
          teamHashMap[team] = [];
        }
  
        teamHashMap[team].push(session);
      });
  
      return { userSessions, teamHashMap };
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
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
    const newSession = new SessionModel({
        createdby: req.body.userid,
        title: req.body.title,
        date: req.body.date,
        teams: req.body.teams,
        code: generateUID(),
 

    })
    const newUser = new userModel({
        username: req.body.username,
        uimg: req.body.uimg,
        userid: req.body.userid,


 

    })
    newUser.save().then((user) => {
        newSession.save().then((session) => {
            res.json(session);
        }
        )})
  
    
    .catch((err) => {
        res.status(500).send(err.message);
    })

 });
 async function getQuestions(sessionid){
    const questions = await questionModel.find({
        sessionid: sessionid
      });
      return questions
 }
 app.post('/api/get_session', (req, res) => {
    const {userid,sessionid} = req.body
    SessionModel.findById(sessionid).then(async (session) => {
       const questions = await getQuestions(sessionid)
         const usersessions = await getUserSessionsAndTeams(sessionid)
            res.json({usersession:usersessions,session:session,questions:questions})
        
   
    })
 
   

 });
 app.post('/api/get_user_session', (req, res) => {
    const {userid,sessionid} = req.body
    res.json(getUserSessionsAndTeams(sessionid))
   

 });
 app.post('/api/create_question', (req, res) => {
    const {userid,sessionid,question,answers,correct} = req.body

    const newQuestion = new questionModel({
        question: question,
        answers: answers,
        correct: correct,
        sessionid: sessionid,
 

    
    })
    newQuestion.save().then((question) => {
        SessionModel.findById(sessionid).then(async (session) => {
            const questions = await getQuestions(sessionid)
            const usersessions = await getUserSessionsAndTeams(sessionid)
            res.json({usersession:usersessions,session:session,questions:questions})
        
         })
    }
    ).catch((err) => {
        res.status(500).send(err.message);
    })
  
   

 });
 app.post('/api/create_user', (req, res) => {
    const newUser = new userModel({
        username: req.body.username,
        uimg: req.body.uimg,
        userid: req.body.userid,

 

    })
    newUser.save().then((user) => {
        res.json(user);
    }
    ).catch((err) => {
        res.status(500).send(err.message);
    })

    })
  

 
 
app.post('/api/join_session', (req, res) => {
    const {userid,code} = req.body
    SessionModel.findOne({
        code:code
    }).then(session=>{
        const usersession = new SessionUserModel({
            userid: userid,
            sessionid: session._id,
      
            date: Date.now()
    
        })
        usersession.save().then( async (session_) => {
            const newUser = new userModel({
                username: req.body.username,
                uimg: req.body.uimg,
                userid: req.body.userid,
        
         
            
            })
            newUser.save().then(async (user) => {
                const questions = await getQuestions(session._id)
                const usersessions = await getUserSessionsAndTeams(session._id)
                res.json({usersession:usersessions,session:session,questions:questions})
            }
            ).catch((err) => {
                res.status(500).send(err.message);
            })
        
        }
        ).catch((err) => {
            res.status(500).send(err.message);
        })

    })
})
 
app.get('/images', (req, res) => {
    

    res.json({ images: pngFiles });
  });
app.use('/public', express.static('./images'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
