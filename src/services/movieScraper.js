// Cheerio DOM Parser
const cheerio = require('cheerio')

// core modules
const logger = require('../config/logger')
const config = require('../config/config').getInstance()

// fetchHtml
const html = require('../utils/fetchHtml')

class MovieScraper {
  constructor () {
    try {
      this.url = config.url
      this.movieId = this.url.split('/').pop()
      this.ratingValue = undefined
      this.title = undefined
      this.releaseDate = undefined
      this.genre = undefined
      this.casting = []
      this.director = undefined
      this.reviews = []
    } catch (error) {
      logger.error(`MovieScraper: ${error}`)
    }
  }

  async init () {
    try {
      await this.fillBaseData()
      await this.fillCasting()
      await this.getTwoReviewsByMode('positive')
      await this.getTwoReviewsByMode('negative')
      await this.fetchReviewsArticles()
      return this
    } catch (error) {
      logger.error(`MovieScraper: ${error}`)
    }
  }

  async fillBaseData () {
    // Get global data about the targeted movie
    try {
      const homePage = await html.fetch(this.url)
      const $ = cheerio.load(homePage)

      this.ratingValue = $('.pvi-scrating-value').text()
      this.title = $('.lahe-breadcrumb-item').text()
      this.releaseDate = new Date($('.pvi-productDetails-item > time').attr('datetime'))
      this.genre = $('.pvi-productDetails-item > h3 > a > span').text().toLowerCase()
      this.director = $('.pvi-productDetails-item > span > a > span').text()
    } catch (error) {
      logger.error(`MovieScraper: ${error}`)
    }
  }

  async fillCasting () {
    // Get the full Casting by actors/actresses names
    try {
      const castingPage = await html.fetch(`${this.url}/details`)
      const $ = cheerio.load(castingPage)

      this.casting = $("table.pde-data:not('.d-rubric') td > a, .ecot-contact-label").toArray().map((element) => {
        return $(element).text()
      })
    } catch (error) {
      logger.error(`MovieScraper: ${error}`)
    }
  }

  async getTwoReviewsByMode (mode) {
    // mode is a type of String and defined by 'positive' or 'negative
    try {
      const reviewsPage1 = await html.fetch(`https://www.senscritique.com/sc2/${this.movieId}/critiques/${mode}.ajax`)
      const $ = cheerio.load(reviewsPage1)

      // construct data structure that will hold metadata related to reviews
      $('article.ere-review.ere-box').toArray().slice(0, 2).forEach((element) => {
        const url = `https://www.senscritique.com${$(element).find('p > a').attr('href')}`
        this.reviews.push({
          url: url,
          id: url.split('/').pop(),
          author: $(element).find('.ere-review-author > span').text().trim(),
          rate: parseInt($(element).find('.elrua-useraction-inner').text().trim())
        })
      })
    } catch (error) {
      logger.error(`MovieScraper: ${error}`)
    }
  }

  async fetchReviewsArticles () {
    try {
      // fetch full reviews articles
      for (const review of this.reviews) {
          const reviewPage = await html.fetch(review.url)
          const $ = cheerio.load(reviewPage)

          review.article = $('.rvi-review-content').text().trim()
      }
    } catch (error) {
      logger.error(`MovieScraper: ${error}`)
    }
  }
}

module.exports = MovieScraper
