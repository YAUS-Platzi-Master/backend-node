const redis = require('redis')
const { config } = require('../config')
const { Sentry } = require('../utils/errorReporting')

const client = redis.createClient(config.redisUrl)

function isCached (shortUrl) {
  return new Promise((resolve, reject) => {
    client.get(shortUrl, (err, data) => {
      if (err) return reject(err)
      let res = data || null
      if (res) res = JSON.parse(res)
      resolve(res)
    })
  })
}

async function saveCache (key, data) {
  try {
    // TODO:
    // In this part the `await` is unnecessary
    await client.setnx(key, data)
    return true
  } catch (err) {
    Sentry.captureException(err)
  }
}

client.on('error', function (err) {
  Sentry.captureException(err)
})

module.exports = {
  saveCache,
  isCached
}
