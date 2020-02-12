// core modules
const logger = require('./logger')
const config = require('./config').getInstance()
const pg = require('pg')

let instance = null

class DB {
  constructor () {
    this.client = new pg.Client(config.connectionString)
    try {
      this.client
        .connect()
        .then(() => {
          logger.debug('Connection has been established successfully.')
        })
        .catch(err => {
          logger.error('Unable to connect to the database:', err)
        })
    } catch (error) {
      logger.error(`DB:${error}`)
    }
  }

  static getInstance () {
    if (!instance) {
      instance = new DB()
    }

    return instance
  }
}

module.exports = DB
