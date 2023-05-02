const express = require('express');
const mongoose = require('mongoose')
const guitarModel = mongoose.model('guitar')
const router = express.Router();

// Defining functions on different methods
router.route('/').get((req, res, next) => {
    getAllGuitars(res)
}).post((req, res, next) => {
    if (!req.body) return res.status(400).send('Request body is missing')
    else if (!req.body.product_id) return res.status(400).send('Product ID missing from request body')
    else if (!req.body.brand) return res.status(400).send('Brand missing from request body')
    else if (!req.body.model) return res.status(400).send('Model missing from request body')
    else if (!req.body.type) return res.status(400).send('Type missing from request body')  
    else if (!req.body.color) return res.status(400).send('Color missing from request body')  
    else if (!req.body.price) return res.status(400).send('Price missing from request body')  
    else if (!req.body.image_url) return res.status(400).send('Image URL missing from request body')  
    else createGuitar(req, res)
}).put((req, res, next) => {
    if (!req.body) return res.status(400).send('Request body is missing')
    else if (!req.body.product_id) return res.status(400).send('Product ID missing from request body')
    else if (!req.body.brand) return res.status(400).send('Brand missing from request body')
    else if (!req.body.model) return res.status(400).send('Model missing from request body')
    else if (!req.body.type) return res.status(400).send('Type missing from request body')  
    else if (!req.body.color) return res.status(400).send('Color missing from request body')  
    else if (!req.body.price) return res.status(400).send('Price missing from request body')  
    else if (!req.body.image_url) return res.status(400).send('Image URL missing from request body')  
    else updateGuitar(req, res)
}).delete((req, res, next) => {
    if (!req.body.product_id) return res.status(400).send("Product ID parameter required")
    else deleteGuitar(req.body.product_id, res)
})

// Retrieving all guitars
function getAllGuitars(res) {
    guitarModel.find({}, (err, guitars) => {
        if (err) return res.status(500).send('Unable to reach database', err)
        else res.status(200).send(guitars)
    })
}

// Creating new guitar product
function createGuitar(req, res) {
    guitarModel.findOne({ product_id: req.body.product_id }, (err, gtr) => {
        if (err) return res.status(500).send('Unable to reach database', err)
        else if (gtr) return res.status(400).send('Product already exists')
        else {
            const guitar = new guitarModel({
                product_id: req.body.product_id,
                brand: req.body.brand,
                model: req.body.model,
                type: req.body.type,
                color: req.body.color,
                price: req.body.price,
                image_url: req.body.image_url
            })
            guitar.save((err) => {
                if (err) return res.status(500).send('Unable to save guitar', err)
                else res.status(201).send('Guitar has been saved')
            })
        }
    })
}

// Updating existing guitar product
function updateGuitar(req, res) {
    guitarModel.findOne({ product_id: req.body.product_id }, (err, guitar) => {
        if (err) return res.status(500).send('Unable to reach database', err)
        else if (!guitar) return res.status(404).send('Guitar does not exist')
        else {
            guitar.brand = req.body.brand,
            guitar.model = req.body.model,
            guitar.type = req.body.type,
            guitar.color = req.body.color,
            guitar.price = req.body.price,
            guitar.image_url = req.body.image_url,
            guitar.updated_at = Date.now()

            guitar.save((err) => {
                if (err) return res.status(500).send('Unable to save guitar', err)
                else res.status(200).send('Guitar has been updated')
            })
        }
    })
}

// Deleting guitar product
function deleteGuitar(product_id, res) {
    guitarModel.findOne({ product_id: product_id }, (err, guitar) => {
        if (err) return res.status(500).send('Unable to reach database', err)
        if (guitar) {
            guitar.delete(err => {
                if (err) return res.status(500).send('Unable to delete guitar', err)
                else return res.status(200).send("Guitar has been deleted")
            })
        }
        else return res.status(404).send('Guitar does not exists')
    })
}

module.exports = router