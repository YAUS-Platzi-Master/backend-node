function handleFatalError (err) {
  console.error(`'[fatal error]' ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

module.exports = {
  handleFatalError
}
