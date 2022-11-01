const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Task = require('../models/tasks')
const auth = require('../middleware/authorization')
const bcrypt = require('bcrypt');



router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user, token})
    }catch(error){
        if(error.message.includes("E11000")){
            error.message = 'User with this email already exists, try again with another email'
        }
        res.status(400).send(error.message)
    }
})

router.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.save()
        res.send({user, token})
    } catch (error){
        res.status(400).send(error.message)
    }
})

router.post('/logout', auth,  async (req, res) => {
    try{
        const user = req.user
        user.tokens = user.tokens.filter((token)=> token.token !== req.token)

        user.save()
        res.send('Sucessfully logout')
    } catch (error){
        res.status(500).send(error.message)
    }
})

router.post('/logoutAll', auth, async (req, res) =>{
    try{
        req.user.tokens = [];
        await req.user.save()
        res.send('Successfully logged out of all devices')
    }catch(error){
        res.status(500).send(error.message)
    }
})


router.get('/users/me', auth, (req, res)=>{
    try{
        res.send(req.user)
    } catch(error){
        res.status(500).send(error.message)

    }
})

router.patch('/users', auth, async (req, res) => {
    try{
        const keys = Object.keys(req.body)
        const avaibleUpdates = ['name', 'password', 'email']
    
        const isValidUpdate = keys.every(key => avaibleUpdates.includes(key)) // < --- double check
        
        if(!isValidUpdate){
            throw new Error('Invalid update')
        }
    
        keys.forEach(key=>req.user[key] = req.body[key])
        
        req.user.save()    
        res.send(req.user)
    }catch(error){
        res.status(500).send(error.message)
    }

})

router.delete('/users', auth, async (req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.user._id)
        const tasks = await Task.deleteMany({owner: req.user._id})

        res.send({user, tasks})
    }catch(error){
        res.status(500).send(error.message)
    }

})

module.exports = router
