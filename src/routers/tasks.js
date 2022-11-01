const express = require('express')
const router = express.Router()
const Task = require('../models/tasks')
const auth = require('../middleware/authorization')

router.post('/tasks', auth, async (req, res) => {
    try{
        const task = new Task({ ...req.body, owner: req.user._id })
        task.save()
        res.status(201).send(task)
    } catch(error){
        res.status(500).send(error.message)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try{
        const tasks = await Task.find({owner: req.user._id})
        if(!tasks){
            throw new Error('Cannot find tasks')
        }
        res.send(tasks)
    } catch(error){
        res.status(404).send(error.message)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try{
        const _id = req.params.id
        const task = await Task.findById({_id})
        if(!task){
            throw new Error('Cannot find task')
        }
        res.send(task)
    } catch(error){
        res.status(404).send(error.message)

    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    try{
        const _id = req.params.id
        const task = await Task.findById({_id})

        const incomingUpdates = Object.keys(req.body)
        const allowedUpdates = ['title', 'description', 'done']

        const isValidUpdate = incomingUpdates.every(update => allowedUpdates.includes(update))
        if(!isValidUpdate){
            throw new Error('Invalid update')
        }

        incomingUpdates.forEach((update)=>{
            task[update] = req.body[update]
        })

        task.save()
        res.send(task)
    } catch(error){
        res.status(500).send(error.message)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const _id = req.params.id
        const task = await Task.findByIdAndDelete(_id)
        if(!task){
            throw new Error('Cannot find task to delete')
        }

        res.send(task)
    } catch(error){
        res.status(404).send(error.message)
    }
})

module.exports = router