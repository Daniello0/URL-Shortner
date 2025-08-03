import Url from "./Url";
import UserStatistic from "./UserStatistic";
import UrlShortner from "../service/UrlShortner";
import DataMiner from "../service/DataMiner";

export default class Data {

    #url = null;
    #shortUrl = null;
    #userStatistic = [];

    constructor(url) {
        this.#url = new Url(url);
        this.#shortUrl = new UrlShortner().getShortUrl(url);
    }

    addUserStatistic() {
        this.#userStatistic.push(new DataMiner().getUserStatisticData());
    }

    get url() {
        return this.#url;
    }

    get userStatistic() {
        return this.#userStatistic;
    }

    get shortUrl() {
        return this.#shortUrl;
    }

}