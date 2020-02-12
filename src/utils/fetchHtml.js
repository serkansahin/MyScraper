const axios = require('axios')
const logger = require('../config/logger')

async function fetch (url) {
  try {
    const response = await axios.get(url)

    if (response && response.data) {
      logger.debug(`HtmlScraper: HTML content from ${url} has been fetched!`)

      return response.data
    } else {
      throw new Error(`HtmlScraper: No data from ${url} has been fetched!`)
    }
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  fetch
}
