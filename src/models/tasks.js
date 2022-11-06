const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        require:true,
        trim: true,
        minLength: 2,
    },
    description:{
        type: String,
        trim: true,
        minLength: 2,
    },
    done: {
        type: Boolean,
        default: false,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User',
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task