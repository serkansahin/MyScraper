// core modules
const logger = require('./config/logger')

// Scraper
const MovieScraper = require('./services/movieScraper')

async function app () {
  logger.info('Starting MovieScraper..')
  await new MovieScraper().init()
  logger.info('Movie has been scrapped')
}

app()
