const express = require('express');
const mongoose = require('mongoose')
const userModel = mongoose.model('user')
const router = express.Router();

// Defining functions on different methods
router.route('/').get((req, res, next) => {
    getAllUser(res)
}).post((req, res, next) => {
    if (!req.body) return res.status(400).send('Request body is missing')
    else if (!req.body.username) return res.status(400).send('Username missing from request body')
    else if (!req.body.password) return res.status(400).send('Password missing from request body')
    else if (!req.body.email) return res.status(400).send('Email missing from request body')  
    else createUser(req, res)
}).put((req, res, next) => {
    if (!req.body) return res.status(400).send('Request body is missing')
    else if (!req.body.username) return res.status(400).send('Username missing from request body')
    else if (!req.body.password) return res.status(400).send('Password missing from request body')
    else if (!req.body.email) return res.status(400).send('Email missing from request body')  
    else updateUser(req, res)
}).delete((req, res, next) => {
    if (!req.body.username) return res.status(400).send("Username parameter required")
    else deleteUser(req.body.username, res)
})

// Retrieving all users
function getAllUser(res) {
    userModel.find({}, (err, users) => {
        if (err) return res.status(500).send('Unable to reach database', err)
        else res.status(200).send(users)
    })
}

// Creating new user - AKA Register route
function createUser(req, res) {
    userModel.findOne({ username: req.body.username }, (err, usr) => {
        if (err) return res.status(500).send('Unable to reach database', err)
        else if (usr) return res.status(400).send('Username already taken')
        else {
            const user = new userModel({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                role: 'DEFAULT'
            })
            user.save((err) => {
                if (err) return res.status(500).send('Unable to save user', err)
                else res.status(201).send('User has been created')
            })
        }
    })
}

// Updating existing user
function updateUser(req, res) {
    userModel.findOne({ username: req.body.username }, (err, user) => {
        if (err) return res.status(500).send('Unable to reach database', err)
        else if (!user) return res.status(404).send('Username does not exist')
        else {
            if(user.password != req.body.password) user.last_password_changed_date = Date.now()
            user.password = req.body.password
            user.email = req.body.email
            user.updated_at = Date.now()

            user.save((err) => {
                if (err) return res.status(500).send('Unable to save user', err)
                else res.status(200).send('User has been updated')
            })
        }
    })
}

// Deleting user
function deleteUser(username, res) {
    userModel.findOne({ username: username }, (err, user) => {
        if (err) return res.status(500).send('Unable to reach database', err)
        if (user) {
            user.delete(err => {
                if (err) return res.status(500).send('Unable to delete user', err)
                else return res.status(200).send("User has been deleted")
            })
        }
        else return res.status(404).send('User does not exists')
    })
}

module.exports = router