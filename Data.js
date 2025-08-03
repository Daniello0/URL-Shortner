import Url from "./Url";
import UrlStatistic from "./UrlStatistic";

export default class Data {

    #url = null;
    #urlStatistic = null;

    constructor( { url, urlStatistic } ) {
        this.#url = new Url(url);
        this.#urlStatistic = new UrlStatistic(urlStatistic);
    }

    get url() {
        return this.#url;
    }

    get urlStatistic() {
        return this.#urlStatistic;
    }

}