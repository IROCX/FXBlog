var mongoose = require('mongoose')
var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    date: { type: Date, default: Date.now },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
})

module.exports = mongoose.model('campground', campgroundsSchema)