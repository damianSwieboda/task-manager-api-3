const express = require('express')
const router = express.Router()
const User = require('../models/users')


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        res.send(user)
    }catch(error){
        res.status(400).send(error.message)
    }
})

module.exports = router
