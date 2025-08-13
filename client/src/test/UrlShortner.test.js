import ShortUrlIndex from "../service/ShortUrlIndex";

describe('ShortUrl', () => {
    test('Получить короткую ссылку', async () => {
        const shortUrl = await ShortUrlIndex.getShortUrlIndex();
        console.log(shortUrl);
    })
})