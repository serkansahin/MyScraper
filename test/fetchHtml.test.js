const fetchHtml = require('../src/utils/fetchHtml')

test('test fetch function', async () => {
    const testUrl = 'https://www.senscritique.com/film/Joker/27059297'
    const data = await fetchHtml.fetch(testUrl)

    expect(data).not.toBeUndefined()
});
