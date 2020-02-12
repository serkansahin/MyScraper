const MovieScraper = require('../src/services/movieScraper')

test('test movie scraper', async () => {
    const testUrl = 'https://www.senscritique.com/film/Joker/27059297'
    const data = await new MovieScraper(testUrl).init()

    expect(data).not.toBeUndefined()
    expect(data.title).toEqual('Joker')
    expect(data.director).toEqual('Todd Phillips')
    expect(data.releaseDate).toEqual(new Date('2019-10-09'))
});
