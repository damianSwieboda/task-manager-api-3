const express = require('express')
const router = express.Router()
const User = require('../models/users')


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken()
        console.log(token)

        await user.save()
        res.send({user, token})
    }catch(error){
        res.status(400).send(error.message)
    }
})


module.exports = router
