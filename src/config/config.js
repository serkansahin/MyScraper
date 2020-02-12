// module variables
const config = require('../../config/config.json')
const logger = require('./logger')

let instance = null

class Config {
  constructor () {
    const environment = process.env.NODE_ENV || 'development'
    const configEnv = config[environment]

    try {
      if (configEnv) {
        if (configEnv.database.connectionString && configEnv.url) {
          this.connectionString = config[environment].database.connectionString
          this.url = config[environment].url
        } else {
          throw new Error('Configuration is not correctly set!')
        }
      }
    } catch (error) {
      logger.error(error)
      process.exit(1)
    }
  }

  static getInstance () {
    if (!instance) {
      instance = new Config()
    }

    return instance
  }
}

module.exports = Config
