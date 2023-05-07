const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const expressSession = require('express-session')

const app = express()

// Declaring constants
const port = process.env.PORT || 3000
const dbUrl = 'mongodb://localhost:27017/PRF'
const secret = 'w4QCMtfrZgPR3g3h9Vhmprk5XHZGPHY9G3sU4p96gJ251pxNW9kcRM8ouYJkx3dX'

// Connecting to database
mongoose.connect(dbUrl);
mongoose.connection.on('connected', () => console.log('Connected to database!'))
mongoose.connection.on('error', err => console.log('Error while connecting to database', err))

// Importing database models
require('./user.model')
require('./guitar.model')

const userModel = mongoose.model('user')

// Creating required users
require('./db/users')();

// HTTP Request configuration
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({}))

// CORS configuration
app.use(cors({origin:true,credentials: true}));

// Authenticating request from cookie
passport.use('local', new localStrategy(function (username, password, done) {
    userModel.findOne({ username: username }, function (err, user) {
        if (err) return done('Error retrieving user', null)
        else if (!user) return done('User does not exist', null)
        else user.comparePasswords(password, function (err, isMatch) {
            if (err) return done('Error', false)
            if (!isMatch) return done('Incorrect password', false)
            return done(null, user)
        })
    })
}))

// Serializing user
passport.serializeUser(function (user, done) {
    if (!user) return done('No user to login', null)
    return done(null, user)
})

// Deserializing user
passport.deserializeUser(function (user, done) {
    if (!user) return done('No user to logout', null)
    return done(null, user)
})

// Session handling configuraitons
app.use(expressSession({ secret: secret, resave: true }))
app.use(passport.initialize())
app.use(passport.session())

// Root page
app.get('/', (req, res, next) => {
    res.send({ message: "Root Page" })
})

// Defining routes
app.use('/user', require('./user-routes'))
app.use('/guitar', require('./guitar-routes'))
app.use('/session', require('./auth-routes'))

// Fallback error page
app.use((req, res, next) => {
    res.status(404).send("Page does not exist")
})

// Server start health check
app.listen(port, () => {
    console.log("Server has been started!")
})