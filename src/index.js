const express = require('express')
const helmet = require('helmet')
const { validateShortUrl, saveHits } = require('./lib/db')
const { errorReporting, handleFatalError } = require('./utils/errorReporting')
const { config } = require('./config')

const app = express()

// middleware
app.use(express.json())
app.use(helmet())
app.use(errorReporting)

// main route
app.get(/^\/[a-z0-9-]+$/i, async function (req, res, next) {
  try {
    const shortUrl = await req.url.slice(1)
    const longUrl = await validateShortUrl(shortUrl)
    if (longUrl === undefined) {
      res.redirect('/')
    } else {
      saveHits(longUrl.id, req)
      res.redirect(longUrl.long_url)
    }
  } catch (error) {
    next(error)
  }
})

// page not found
app.get('/*', function (req, res) {
  res.status(404).json('Page Not Found')
})

const server = app.listen(config.port, function () {
  console.log(`Listening on port ${server.address().port}`)
})

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
