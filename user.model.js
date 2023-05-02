const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
    last_password_changed_date: { type: Date, default: Date.now() }
}, { collection: 'users' })

mongoose.model('user', userSchema)