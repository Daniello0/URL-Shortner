import UrlShortner from "../service/UrlShortner";
import DataMiner from "../service/DataMiner";

export default class Data {

    url = null;
    shortUrl = null;
    statUrl = null;
    userStatistic = [];

    constructor (originalUrl, shortUrl, statUrl, userStatistic = []) {
        this.url = originalUrl;
        this.shortUrl = shortUrl;
        this.statUrl = statUrl;
        this.userStatistic = userStatistic;
    }

    static async create(urlString) {
        try {
            const originalUrl = new URL(urlString);

            const shortner = new UrlShortner();
            const shortUrlString = await shortner.getShortUrlString(urlString);

            if (!shortUrlString) {
                console.error("Не удалось создать короткую ссылку");
            }

            const shortUrl = new URL(shortUrlString);
            const statUrl = new URL(shortUrlString + "+");

            return new Data(originalUrl, shortUrl, statUrl);

        } catch (error) {
            console.error("Ошибка при создании Data-класса:", error);
            return null; // Возвращаем null в случае ошибки
        }
    }

    async addUserStatistic() {
        this.userStatistic.push(await new DataMiner().getUserStatisticData());
    }
}