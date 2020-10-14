const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

require("./src/configs/database.config")
  .connect(err => console.log(err ? err : "Database working"))

// Middlewares
const { statusNotFound } = require('./src/middlewares/serverHandler.middleware')
const { verify } = require('./src/middlewares/auth.middleware')

// Routers
const indexRouter = require('./src/routes/index.route')
const authRouter = require('./src/routes/auth.route')
const usersRouter = require('./src/routes/users.route')
const topupRouter = require('./src/routes/topup.route')
const transferRouter = require('./src/routes/transfer.route')

const app = express()

app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("*", cors())
app.use(`${process.env.PREFIX}/`, indexRouter)
app.use(`${process.env.PREFIX}/auth`, authRouter)
app.use(`${process.env.PREFIX}/users`, verify, usersRouter)
app.use(`${process.env.PREFIX}/topup`, topupRouter)
app.use(`${process.env.PREFIX}/transfer`, transferRouter)

// Handle Error Notfound 
app.use(statusNotFound)


module.exports = app