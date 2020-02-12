// DB
const DB = require('../config/db').getInstance()
const logger = require('../config/logger')

class Movies {
  constructor (scrapedData) {
    this.client = DB.client
    this.scrapedData = scrapedData
    this.init()
  }

  init () {
    this.client.query(`CREATE TABLE IF NOT EXISTS movies(
      id SERIAL PRIMARY KEY,
      movie_id INTEGER UNIQUE,
      title TEXT,
      rating FLOAT,
      director TEXT,
      genre TEXT,
      url TEXT,
      release_date DATE,
      casting TEXT ARRAY,
      reviews JSONB)`)
      .then((resolve, reject) => {
        if (resolve) {
          logger.debug('Successfully created table or table does already exists')
        }

        if (reject) {
          logger.error('Failure on table creation!')
        }
      })
  }

  async insert () {
    try {
      const resp = await this.client.query(`INSERT INTO movies(
        movie_id, 
        title, 
        rating, 
        director, 
        genre, 
        url, 
        release_date, 
        casting,
        reviews) values($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [this.scrapedData.movieId,
        this.scrapedData.title,
        this.scrapedData.ratingValue,
        this.scrapedData.director,
        this.scrapedData.genre,
        this.scrapedData.url,
        this.scrapedData.releaseDate,
        this.scrapedData.casting,
        JSON.stringify(this.scrapedData.reviews)
      ])
      logger.debug('Movies: scraped data have been successfully inserted into the DB')
      return resp
    } catch (error) {
      logger.error(error)
    }
  }

  async getRecordByMovieId (movieId) {
    // movieId corresponds to SensCritique's generated ID
    try {
      const resp = await this.client.query(`SELECT * FROM movies WHERE movie_id = ${movieId}`)
      logger.debug(`Movies: movie ${movieId} has been retrieved`)
      return resp.rows[0]
    } catch (error) {
      logger.error(error)
    }
  }

  async getRecordById (id) {
    // id corresponds to MyScraper's generated DB ID
    try {
      const resp = await this.client.query(`SELECT * FROM movies WHERE id = ${id}`)
      logger.debug(`Movies: movie ${id} has been retrieved`)
      return resp.rows[0]
    } catch (error) {
      logger.error(error)
    }
  }
}

module.exports = Movies
