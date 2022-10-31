const express = require('express')
const router = express.Router()
const User = require('../models/users')
const auth = require('../middleware/authorization')
const bcrypt = require('bcrypt');



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

router.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.save()
        res.status(201).send({user, token})
    } catch (error){
        res.status(400).send(error.message)

    }

})

router.get('/logout', auth,  async (req, res) => {
    try{
        const user = req.user
        console.log('z api, tokens przed' + user.tokens)
        user.tokens = user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        console.log('z api, user po' + user.tokens)

        user.save()
        res.send('Sucessfully logout')
    } catch (error){
        res.status(500).send(error.message)
    }
})

router.get('/user/me', auth, (req, res)=>{
    try{
        const user = req.user
        res.send(user)
    } catch(error){
        res.status(500).send(error.message)

    }
})


module.exports = router
