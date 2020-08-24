const express = require('express')
const helmet = require('helmet')
const { handleFatalError } = require('./utils/handler')
const { config } = require('./config')

const app = express()

app.use(express.json())
app.use(helmet())

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

const server = app.listen(config.port, function () {
  console.log(`Listening on port ${server.address().port}`)
})
