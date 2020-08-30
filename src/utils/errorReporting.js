const Sentry = require('@sentry/node')
const { config } = require('../config')

Sentry.init({
  dsn: config.sentryDns
})

function errorReporting (err, req, res, next) {
  Sentry.captureException(err)
  next(err)
}

function handleFatalError (err) {
  Sentry.captureException(err)
  process.exit(1)
}

module.exports = {
  handleFatalError,
  errorReporting,
  Sentry
}
