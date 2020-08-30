const Referer = require('referer-parser')

async function referer (ref) {
  const httpReferer = await new Referer(ref)
  return httpReferer.referer || 'Direct'
}

module.exports = referer
