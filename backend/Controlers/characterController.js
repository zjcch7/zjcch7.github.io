const User = require('../models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/CustomError')
const jwt = require('jsonwebtoken');
const util = require('util');
const express = require('express');
//const characterModel = require ('../models/Character')
const { CharacterModel, SelectedCharacterModel, VoteModel } = require("../models/Character")
    //const selectedCharacterModel = require('../models/SelectedCharacter');
const app = express();

exports.addCharacter = asyncErrorHandler(async(req, res, next) => {
    let token;

    console.log(req.headers)

    // Check for token in cookies first
    if (req.cookies.token) {
        token = req.cookies.token;
    } else {
        console.log("No token")
    }



    if (!token) {
        return next(new CustomError('You are not logged in!', 401));
    }

    try {
        // Verify the token
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);



        // Retrieve the user based on the token's user ID
        const currentUser = await User.findById(decodedToken.id);
        console.log(currentUser)
        if (!currentUser) {
            return next(new CustomError('You are not logged in!', 401));
        }

        // Attach the user to the request object
        req.user = currentUser;
        //next();
    } catch (error) {
        // Error handling remains unchanged
        // ...

        console.log("Something went wrong")
    }

    const character = new CharacterModel({
        name: req.body.name,
        source: req.body.source,
        genre: req.body.genre,
        powers: req.body.powers,
        rank: req.body.rank,
        createdBy: req.user
    })
    character.save().then(createList => {
        res.status(201).json({
            message: 'Character added successfully'
        });
    })
})

exports.showUserCharacters = asyncErrorHandler(async(req, res, next) => {
    //console.log("Function called")
    let token;

    //console.log(req.headers)

    // Check for token in cookies first
    if (req.cookies.token) {
        token = req.cookies.token;
    } else {
        console.log("No token")
    }



    if (!token) {
        return next(new CustomError('You are not logged in!', 401));
    }

    try {
        // Verify the token
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);



        // Retrieve the user based on the token's user ID
        const currentUser = await User.findById(decodedToken.id);
        //console.log(currentUser)
        if (!currentUser) {
            return next(new CustomError('You are not logged in!', 401));
        }

        // Attach the user to the request object
        req.user = currentUser;
        //next();
    } catch (error) {
        // Error handling remains unchanged
        // ...

        console.log("Something went wrong")
    }

    //console.log("finding characters")
    CharacterModel.find({ createdBy: req.user }).sort({ rank: 'asc' }).then(
        characters => {
            res.status(200).json({
                message: "characters retrived",
                list: characters

            });
        })
})

exports.getRandomCharacters = async() => {
    try {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const existingBallot = await SelectedCharacterModel.findOne({ timestamp: { $gte: yesterday } })

        //console.log("Exisiting Ballot: ", existingBallot)

        if (!existingBallot) {
            console.log("No ballot found")
            const randomCharacters = await CharacterModel.aggregate([{ $sample: { size: 2 } }])

            await SelectedCharacterModel.create({
                characters: randomCharacters.map(character => character._id),
                timestamp: new Date(),
            })

            console.log('Selected characters for voting: ', randomCharacters)
            return randomCharacters
        } else {

            console.log('Using Existing ballot for voting: ', existingBallot.characters);

            const votingCharacters = await CharacterModel.find({ _id: { $in: existingBallot.characters } })

            //console.log("Voting Characters: ", votingCharacters)

            return votingCharacters;

            //return await CharacterModel.find({ _id: { $in: existingBallot.characters }});
        }
    } catch (error) {
        console.error('Error selecting random characters for voting: ', error)
        return null;
    }
}

exports.getVotingCharacters = asyncErrorHandler(async(req, res, next) => {
    try {

        const latestTimeStamp = await SelectedCharacterModel.findOne({}, {}, { sort: { 'timestamp': -1 } })

        if (latestTimeStamp) {
            // const ballot = await CharacterModel.find({_id: {$in: latestTimeStamp.characters}})
            // return ballot;

            CharacterModel.find({ _id: { $in: latestTimeStamp.characters } }).then(
                retrievedCharacters => {
                    res.status(200).json({
                        message: "voting characters retrieved",
                        ballot: retrievedCharacters
                    })
                }
            )
        } else {
            console.log("No recent voting characters")
        }
    } catch (error) {
        console.log("Error retrieving voting characters:", error)
    }
})

exports.getAllCharacterLists = asyncErrorHandler(async(req, res, next) => {

    CharacterModel.aggregate([{
        $group: {
            _id: "$createdBy",
            characters: { $push: "$$ROOT" }
        }
    }]).then(
        allCharacters => {

            //console.log(allCharacters)
            const userIds = allCharacters.map(userCharacters => userCharacters._id)
                //console.log(userIds)

            //console.log("about to do user.find")
            User.find({ _id: { $in: userIds } }, 'name').then(users => {

                const userDict = {}
                users.forEach(user => {
                    userDict[user._id] = user.name
                })

                //console.log(userDict)

                //console.log(util.inspect(allCharacters, { depth: null }));
                // allCharacters.forEach(userCharacters => {
                //     userCharacters.characters.forEach(character => {
                //         //console.log("Character: " ,character)
                //         character.username = userDict[userCharacters._id]
                //     })

                // })

                const updatedAllCharacters = allCharacters.map(userCharacters => {
                    const userId = userCharacters._id
                    const username = userDict[userId]

                    return {
                        _id: userId,
                        username: username,
                        characters: userCharacters.characters
                    }
                })

                res.status(200).json({
                    message: "got all characters",
                    characterList: updatedAllCharacters
                })

            })

            //console.log(util.inspect(allCharacters, { depth: null }));
            // res.status(200).json({
            //     message: "got all characters",
            //     characterList: updatedAllCharacters
            // })
        }
    )
})

exports.vote = asyncErrorHandler(async(req, res, next) => {
    //console.log("trying to vote")
    //console.log("Function called")
    let token;

    //console.log(req.headers)

    // Check for token in cookies first
    if (req.cookies.token) {
        token = req.cookies.token;
    } else {
        console.log("No token")
    }



    if (!token) {
        return next(new CustomError('You are not logged in!', 401));
    }

    try {
        // Verify the token
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);



        // Retrieve the user based on the token's user ID
        const currentUser = await User.findById(decodedToken.id);
        //console.log(currentUser)
        if (!currentUser) {
            return next(new CustomError('You are not logged in!', 401));
        }

        // Attach the user to the request object
        req.user = currentUser;
        //next();
    } catch (error) {
        // Error handling remains unchanged
        // ...

        console.log("Something went wrong")
    }

    const userID = req.user._id
        //console.log("User ID:" , userID)
    const characterID = req.body._id

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingVote = await VoteModel.findOne({
        userID,
        createdAt: { $gte: today }
    })

    if (existingVote) {
        console.log("you already voted")
        return res.status(400).json({ message: "you have already voted today!" })
    }

    const newVote = new VoteModel({
        characterID: characterID,
        userID: userID
    })
    newVote.save().then(createVote => {
        res.status(201).json({
            message: "vote recorded"
        })
    })
})


exports.countVote = asyncErrorHandler(async(req, res, next) => {
    console.log("counting votes...")
        //console.log(req.query)
    const characterID = req.query.characterID
    console.log(characterID)

    const voteCount = await VoteModel.countDocuments({ characterID })
    console.log(voteCount)

    res.status(201).json({
        voteCount: voteCount
    })
})


// characterModel.aggregate([{ $sample: { size: 2} }]).then(
//     randomCharacters => {
//         res.status(200).json({
//             message: "voting characters retrived",
//             ballot: randomCharacters
//         })
//     }
// )