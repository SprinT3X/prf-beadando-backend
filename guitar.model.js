const mongoose = require('mongoose')

var guitarSchema = new mongoose.Schema({
    product_id: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, min: 0 },
    image_url: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, { collection: 'guitars' })

guitarSchema.pre('save', function (next) {
    const guitar = this
    guitar.updated_at = Date.now()
    return next()
})

mongoose.model('guitar', guitarSchema)