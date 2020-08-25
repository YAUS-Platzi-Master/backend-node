const { Pool } = require('pg')
const { config } = require('../config')
const geoip = require('geoip-lite')

const db = new Pool({
  connectionString: config.databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
})

async function validateShortUrl (shortUrl) {
  const result = await db.query(
    'SELECT id, long_url FROM api_seturl WHERE short_url = $1 LIMIT 1',
    [
      shortUrl
    ])
  return result.rows[0]
}

async function saveHits (id, req) {
  const remoteIp = req.ip
  const geo = await geoip.lookup(remoteIp)

  const httpReferer = req.header('Referer') || ''
  const countryCode = geo === null ? '' : geo.country
  const regionCode = geo === null ? '' : geo.region
  const city = geo === null ? '' : geo.city
  const latitude = geo === null ? '' : geo.ll[0]
  const longitude = geo === null ? '' : geo.ll[1]
  const userAgent = req.headers['user-agent']
  const created = new Date(new Date().getTime())

  const result = await db.query(
    `INSERT INTO api_hit
      (http_reffer, ip, country_code, region_code, city, lattitude, longitude, agent_client, created, set_url_id_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )`,
    [
      httpReferer,
      remoteIp,
      countryCode,
      regionCode,
      city,
      latitude,
      longitude,
      userAgent,
      created,
      id
    ]
  )
}

module.exports = {
  validateShortUrl,
  saveHits
}
