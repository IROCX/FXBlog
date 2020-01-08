var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var userSchema = new mongoose.Schema({
    username: String,
    name:String,
    contact:String,
    email:String,
    password: String
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('user', userSchema)