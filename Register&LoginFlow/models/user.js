// models folder is used to make database schema


const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    gender: String
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel