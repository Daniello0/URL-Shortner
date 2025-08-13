import ShortUrlIndex from "../service/ShortUrlIndex";
import DataMiner from "../service/DataMiner";
import UserStatistic from "./UserStatistic";

export default class Link {

    url: URL;
    shortUrlIndex: string;
    userStatistic: UserStatistic[] | [];

    constructor (originalUrl: URL, shortUrlIndex: string, userStatistic: UserStatistic[] = []) {
        this.url = originalUrl;
        this.shortUrlIndex = shortUrlIndex;
        this.userStatistic = userStatistic;
    }

    static async create(urlString: string): Promise<Link> {
        try {
            const originalUrl = new URL(urlString);

            let shortUrlIndex: string = await ShortUrlIndex.getShortUrlIndex();

            return new Link(originalUrl, shortUrlIndex);

        } catch (error) {
            // console.error("Ошибка при создании Link-класса:", error);
            return new Link(new URL(""), "");
        }
    }

    async addUserStatistic() {
        await new DataMiner().getUserStatisticData().then((userStat: UserStatistic | undefined) => {
            if (!userStat) return;
            this.userStatistic = [...this.userStatistic, userStat];
        });
    }
}