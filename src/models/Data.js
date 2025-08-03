import Url from "./Url";
import UserStatistic from "./UserStatistic";

export default class Data {

    #url = null;
    #urlStatistic = null;

    constructor( { url, Statistic } ) {
        this.#url = new Url(url);
        this.#urlStatistic = new UserStatistic(Statistic);
    }

    get url() {
        return this.#url;
    }

    get urlStatistic() {
        return this.#urlStatistic;
    }

}