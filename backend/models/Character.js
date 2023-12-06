const mongoose = require('mongoose')

const characterDB = mongoose.createConnection(process.env.CHAR_CONN_STR)
console.log("Connected to character database")

const characterSchema = mongoose.Schema({
    name: { type: String, required: true },
    source: { type: String, required: true },
    genre: { type: String, required: true },
    powers: { type: String, required: false },
    rank: { type: Number, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }


})

const CharacterModel = characterDB.model('Character', characterSchema)

const selectedCharacterSchema = new mongoose.Schema({
    characters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character' 
    }],
    timestamp: { type: Date, default: Date.now },
});
  
const SelectedCharacterModel = characterDB.model('SelectedCharacter', selectedCharacterSchema);


const voteSchema = mongoose.Schema({
    characterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    },
    { timestamps: true}

)

const VoteModel = characterDB.model('Vote', voteSchema)

module.exports = {CharacterModel, SelectedCharacterModel, VoteModel}

//module.exports = CharacterModel