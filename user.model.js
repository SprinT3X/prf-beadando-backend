const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

var userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
    last_password_changed_date: { type: Date, default: Date.now() }
}, { collection: 'users' })

userSchema.pre('save', function (next) {
    const user = this
    user.updated_at = Date.now()
    if (user.isModified('password')) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                console.log('Salt generation failed: ', err)
                return next(err)
            } else {
                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) {
                        console.log('Hashing failed: ', err)
                        return next(err)
                    } else {
                        user.password = hash
                        user.last_password_changed_date = Date.now()
                        return next()
                    }
                })
            }
        })
    } else {
        return next()
    }
})

userSchema.methods.comparePasswords = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        callback(err, isMatch)
    })
}

mongoose.model('user', userSchema)