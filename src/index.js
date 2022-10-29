const express = require('express')
const usersRouter = require('./routers/users')

require('./db/mongo')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.use(usersRouter)

// app.get('/', (req, res) => {
//     res.send('THIS MF WORKS')
// })

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})