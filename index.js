const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

// Declaring constants
const port = process.env.PORT || 3000
const dbUrl = 'mongodb://localhost:27017/PRF'

// Connecting to database
mongoose.connect(dbUrl);
mongoose.connection.on('connected', () => console.log('Connected to database!'))
mongoose.connection.on('error', err => console.log('Error while connecting to database', err))

// Importing database models
require('./user.model')
require('./guitar.model')

// HTTP Request configuration
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({}))

// Root page
app.get('/', (req, res, next) => {
    res.send({ message: "Root Page" })
})

// Defining routes
app.use('/user', require('./user-routes'))
app.use('/guitar', require('./guitar-routes'))

// Fallback error page
app.use((req, res, next) => {
    res.status(404).send("Page does not exist")
})

// Server start health check
app.listen(port, () => {
    console.log("Server has been started!")
})