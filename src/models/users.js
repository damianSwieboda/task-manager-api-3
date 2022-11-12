const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Task = require('./tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        minLength: 2,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
        
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, 'Password required'],
        trim: true,
        validate(value){
            if(value.includes('password')){
                throw new Error('Password cannot includes "password" word')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    } 
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function (){
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

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