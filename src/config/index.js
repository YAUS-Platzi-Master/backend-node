require('dotenv').config()

const config = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL
}

module.exports = { config }
