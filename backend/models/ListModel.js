const mongoose = require('mongoose')

listSchema = mongoose.Schema({
    characterName1: { type: String, required: true },
    chararcterSource1: { type: String, required: true },
    characterName2: { type: String, required: true },
    chararcterSource2: { type: String, required: false },
    characterName3: { type: String, required: true },
    chararcterSource3: { type: String, required: false },
    characterName4: { type: String, required: true },
    chararcterSource4: { type: String, required: false },
    characterName5: { type: String, required: true },
    chararcterSource5: { type: String, required: false },
    characterName6: { type: String, required: true },
    chararcterSource6: { type: String, required: false },
    characterName7: { type: String, required: true },
    chararcterSource7: { type: String, required: false },
    characterName8: { type: String, required: true },
    chararcterSource8: { type: String, required: false },
    characterName9: { type: String, required: true },
    chararcterSource9: { type: String, required: false },
    characterName10: { type: String, required: true },
    chararcterSource10: { type: String, required: false },
})

module.exports = mongoose.model('List', listSchema)