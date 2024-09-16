const mongoose = require('mongoose')
const { transform } = require('../utils/mongoose_helper')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username required'],
        unique: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password required']
    },
    name: {
        type: String,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: transform
})

module.exports = mongoose.model('User', userSchema)