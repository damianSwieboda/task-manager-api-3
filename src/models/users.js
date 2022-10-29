const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required']
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    }
})
const User = mongoose.model('User', userSchema)
 
module.exports = User