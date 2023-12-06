const express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const characterModel = require("./models/Character")
    //const commentModel = require("./models/Comments")
const mongoose = require('mongoose')
const authController = require('./Controlers/authController')
const characterController = require('./Controlers/characterController')
const commentController = require('./Controlers/commentController')
const { protect } = require('./Controlers/authController');
const { restrict } = require('./Controlers/authController');
const cors = require("cors");
const helmet = require("helmet")
const session = require("express-session")
const flash = require('express-flash-message').default;
const cookieParser = require("cookie-parser")
const cron = require('node-cron')



app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false, // set to true if WE want a session to be stored even if it's not modified
    resave: false, // forces session to be saved even if it didn't change
    cookie: {
        secure: process.env.NODE_ENV === 'production', // ensures the cookie is only sent over HTTPS in a production environment
        maxAge: 1000 * 60 * 60 * 24 // cookie will expire in 1 day

    }
}));


app.use(
    flash({
        sessionKeyName: 'process.env.FLASH_SESSION'
    })
);

const corsOptions = {
    origin: 'http://localhost:4200', // Allow this origin to make cross-origin requests
    credentials: true, // Credentials are allowed, so cookies can be sent
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'], // add other methods if needed
};



app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Enable pre-flight for all routes


var bodyParser = require('body-parser')



app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    console.log('Middleware');
    next();
})



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use((req, res, next) => {
    next();
})
cron.schedule('0 0 * * *', async() => {
    characterController.getRandomCharacters()
})

app.post("/api/comments", commentController.addComment)

app.get("/api/comments", commentController.getComments)

app.get("/api/replies", commentController.getReplies)

app.post("/api/character", characterController.addCharacter)

app.get('/api/character', characterController.showUserCharacters)

app.get("/api/voting", characterController.getVotingCharacters)

app.get("/api/posts", characterController.getAllCharacterLists)

app.post("/api/signup", authController.signup)

app.post("/api/login", authController.login)

app.post("/api/forgotPassword", authController.forgotPassword)

app.post('/api/resetPassword/:token', authController.resetPassword);

app.post("/api/logout", authController.logout)

app.post("/api/vote", characterController.vote)

app.get('/api/votes', characterController.countVote)


// app.post("/api/list", (req,res,next)=>{
//   console.log("Character Source in backend: " + typeof req.body.characterSource1)
//   const list = new ListModel({
//     characterName1: req.body.characterName1,
//     characterSource1: req.body.characterSource1,
//     characterName2: req.body.characterName2,
//     characterSource2: req.body.characterSource2,
//     characterName3: req.body.characterName3,
//     characterSource3: req.body.characterSource3,
//     characterName4: req.body.characterName4,
//     characterSource4: req.body.characterSource4,
//     characterName5: req.body.characterName5,
//     characterSource5: req.body.characterSource5,
//     characterName6: req.body.characterName6,
//     characterSource6: req.body.characterSource6,
//     characterName7: req.body.characterName7,
//     characterSource7: req.body.characterSource7,
//     characterName8: req.body.characterName8,
//     characterSource8: req.body.characterSource8,
//     characterName9: req.body.characterName9,
//     characterSource9: req.body.characterSource9,
//     characterName10: req.body.characterName10,
//     characterSource10: req.body.characterSource10
//   })
//   list.save().then(createList=>{
//     res.status(201).json({
//       message: 'List added successfully'
//     });
//   })
// })

// app.get("/api/list",(req,res,next)=>{
//   ListModel.find().then(documents => {
//     res.status(200).json({
//       message: 'List retrieval successful',
//       lists: documents
//     });
//   });
// });

module.exports = app