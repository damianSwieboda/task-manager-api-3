const express = require('express')
require('./db/mongo')
const usersRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

const app = express()

app.use(express.json());
app.use(usersRouter)
app.use(taskRouter)

module.exports = { app }
