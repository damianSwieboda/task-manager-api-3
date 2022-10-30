const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

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
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }] 
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'privateKeyXYZ')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

// userSchema.met

const User = mongoose.model('User', userSchema)
 
module.exports = User