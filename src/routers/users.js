const express = require('express')
const router = express.Router()
const User = require('../models/users')
const auth = require('../middleware/authorization')


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken()

        await user.save()
        res.status(201).send({user, token})
    }catch(error){
        res.status(400).send(error.message)
    }
})

router.get('/user', auth, (req, res)=>{
    try{
    const user = req.user
    res.send('xd')

    } catch(error){
        res.status(500).send(error.message)

    }
})


module.exports = router
