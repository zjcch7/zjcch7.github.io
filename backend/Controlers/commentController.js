const User = require('../models/userModel');
const Character = require('../models/Character');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/CustomError')
const jwt = require('jsonwebtoken');
const util = require('util');
const express = require('express');
const CommentModel = require('../models/Comment');
//const selectedCharacterModel = require('../models/SelectedCharacter');
const app = express();

exports.addComment = asyncErrorHandler(async(req, res, next) => {

    const comment = new CommentModel({
        id: req.body.id,
        body: req.body.body,
        username: req.body.username,
        parentId: req.body.parentId,
        createdAt: req.body.createdAt,
        postId: req.body.postId,
    })
    comment.save().then(comments => {
        res.status(201).json({
            message: 'comment added successfully'
        });
    })
});


exports.getComments = asyncErrorHandler(async(req, res, next) => {
    try {
        const comments = await CommentModel.find().sort({ createdAt: 'desc' });
        res.status(200).json({
            message: "comments retrieved",
            list: comments
        });
    } catch (error) {
        console.error('Error retrieving comments:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});
exports.getReplies = asyncErrorHandler(async(req, res, next) => {
    try {
        const replies = await CommentModel.find({ parentId: { $ne: null } }).sort({ createdAt: 'desc' });
        res.status(200).json({
            message: "comments retrieved",
            list: replies
        });

    } catch (error) {
        console.error('Error retrieving comments:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});