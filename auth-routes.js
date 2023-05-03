const express = require('express')
const router = express.Router()
const passport = require('passport')

// Authentication related routes attached to /session
router.route('/')
    .get((req, res, next) => getStatus(req, res))
    .post((req, res, next) => login(req, res))
    .delete((req, res, next) => logout(req, res))

function getStatus(req, res) {
    if (req.isAuthenticated()) {
        return res.status(200).send(JSON.stringify(req.session.passport))
    } else return res.status(401).send('User not logged in')
}

function login(req, res) {
    if (req.body.username && req.body.password) {
        passport.authenticate('local', function (err, user) {
            if (err) return res.status(500).send({ error: err })
            else {
                req.logIn(user, function (err) {
                    if (err) return res.status(500).send({ error: err })
                    else return res.status(200).send('Login was successful')

                })
            }
        })(req, res)
    } else return res.status(400).send('Missing parameters in body')
}

function logout(req, res) {
    if (req.isAuthenticated()) {
        req.logout(() => ({}))
        return res.status(200).send('Logout was successful')
    } else return res.status(401).send('User not logged in')
}

module.exports = router