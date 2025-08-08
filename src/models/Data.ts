import UrlShortner from "../service/UrlShortner";
import DataMiner from "../service/DataMiner";
import UserStatistic from "./UserStatistic";

export default class Data {

    url: URL;
    shortUrl: URL;
    statUrl: URL;
    userStatistic: UserStatistic[] | [];

    constructor (originalUrl: URL, shortUrl: URL, statUrl: URL, userStatistic: UserStatistic[] = []) {
        this.url = originalUrl;
        this.shortUrl = shortUrl;
        this.statUrl = statUrl;
        this.userStatistic = userStatistic;
    }

    static async create(urlString: string): Promise<Data> {
        try {
            const originalUrl = new URL(urlString);

            const shortner = new UrlShortner();
            let shortUrlString: string | null = await shortner.getShortUrlString(urlString);

            if (!shortUrlString) {
                console.error("Не удалось создать короткую ссылку");
                shortUrlString = "";
            }

            const shortUrl = new URL(shortUrlString);
            const statUrl = new URL(shortUrlString + "+");

            return new Data(originalUrl, shortUrl, statUrl);

        } catch (error) {
            console.error("Ошибка при создании Data-класса:", error);
            return new Data(new URL(""), new URL(""), new URL(""));
        }
    }

    async addUserStatistic() {
        await new DataMiner().getUserStatisticData().then(userStat => {
            if (!userStat) return;
            this.userStatistic = [...this.userStatistic, userStat];
        });
    }
}