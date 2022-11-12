const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/users')
const Task = require('../../models/tasks')

const userOneId = mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'userOne',
    email: 'userOne@email.com',
    password: 'userPassword123#',
    tokens: [{
        token: jwt.sign({_id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'userTwo',
    email: 'userTwo@email.com',
    password: 'userPassword123#',
    tokens: [{
        token: jwt.sign({_id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
}
module.exports = { 
    userOne,
    userOneId,
    setupDatabase
}