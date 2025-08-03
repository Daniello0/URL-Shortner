import UrlShortner from "../service/UrlShortner";

describe('UrlShortner', () => {
    test('Получить короткую ссылку', async () => {
        const longUrl = "https://www.desmos.com/calculator?lang=ru";
        let shortner = new UrlShortner();
        const shortUrl = await shortner.getShortUrl(longUrl);
        console.log(shortUrl);
    })
})