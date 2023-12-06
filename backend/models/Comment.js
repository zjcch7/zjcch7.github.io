const mongoose = require('mongoose')

const commentDB = mongoose.createConnection(process.env.COM_CONN_STR)
console.log("Connected to comment database")

const commentSchema = mongoose.Schema({
    id: { type: String, required: true },
    body: { type: String, required: true },
    username: { type: String, required: true },
    parentId: { type: String, required: false },
    postId: { type: String, required: true },
    createdAt: { type: String, required: true },


})

const CommentModel = commentDB.model('Comment', commentSchema)

module.exports = CommentModel