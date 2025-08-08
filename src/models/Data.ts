import UrlShortner from "../service/UrlShortner";
import DataMiner from "../service/DataMiner";
import UserStatistic from "./UserStatistic";

export default class Data {

    url: URL | null = null;
    shortUrl: URL | null = null;
    statUrl: URL | null = null;
    userStatistic: UserStatistic[] | [] = [];

    constructor (originalUrl: URL | null, shortUrl: URL | null, statUrl: URL | null, userStatistic: UserStatistic[] = []) {
        this.url = originalUrl;
        this.shortUrl = shortUrl;
        this.statUrl = statUrl;
        this.userStatistic = userStatistic;
    }

    static async create(urlString: string) {
        try {
            const originalUrl = new URL(urlString);

            const shortner = new UrlShortner();
            const shortUrlString: string | null = await shortner.getShortUrlString(urlString);

            if (!shortUrlString) {
                console.error("Не удалось создать короткую ссылку");
                return null;
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
        await new DataMiner().getUserStatisticData().then(userStat => {
            if (!userStat) return;
            this.userStatistic = [...this.userStatistic, userStat];
        });
    }
}