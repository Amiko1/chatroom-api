//IMPORT EXPRESS
const express = require('express')
const app = express()

//IMPORT CORS
var cors = require('cors')


//IMPORT ROUTERS
const userRouter = require('./routers/users')

//DOTENV
const dotenv = require('dotenv');
dotenv.config()
const port = process.env.PORT 

//INIT DATABASE
require('./db/mongoose')

//REGISTER Midleware
app.use(express.json())
app.use(cors())

//Register routers
app.use('/user', userRouter)


//LISTEN 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 