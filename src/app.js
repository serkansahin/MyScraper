// core modules
const logger = require('./config/logger')

// Scraper
const MovieScraper = require('./services/movieScraper')

// model
const Movies = require('./models/movies')

async function run () {
  logger.info('Starting MovieScraper..')
  const scrapedData = await new MovieScraper().init()
  logger.info('Movie has been scraped')

  const moviesModel = new Movies(scrapedData)
  await moviesModel.insert()
  const movie = await moviesModel.getRecordByMovieId(scrapedData.movieId)

  logger.debug(movie)
  process.exit(0)
}

run()
