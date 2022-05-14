//IMPORT EXPRESS
const express = require('express')
const app = express()

//IMPORT ROUTERS
const userRouter = require('./routers/users')

//DOTENV
const dotenv = require('dotenv');
dotenv.config()
const port = process.env.PORT 

//INIT DATABASE
require('./db/mongoose')

//REGISTER ROUTERS
app.use(express.json())
app.use('/user', userRouter)


//LISTEN 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 