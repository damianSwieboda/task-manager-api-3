const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

userSchema.statics.findByCredentials = async function (email, password){
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Cannot login')
    }
    const isValidPassword = await bcrypt.compare(password, user.password)

    if(!isValidPassword){
        throw new Error('Cannot login')
    }

    return user
}
// userSchema.met

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)
 
module.exports = User