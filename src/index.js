const express = require('express')
const usersRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

require('./db/mongo')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.use(usersRouter)
app.use(taskRouter)


// app.get('/', (req, res) => {
//     res.send('THIS MF WORKS')
// })

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})