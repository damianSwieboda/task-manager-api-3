const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {
    try{
        const token = req.headers.authorization.replace('Bearer ','')
        const decoded = jwt.verify(token, 'privateKeyXYZ')

        const user = await User.findById({_id: decoded._id}) // < --- 
        if(!user){
            throw new Error()
        }

        req.user = user
        req.token = token
        next()
    } catch(error){
        res.send(401).send({error: 'Cannot authenticate.'})
    }

}

module.exports = auth