export default class UserStatistic {

    #date = null;
    #ip = null;
    #region = "";
    #browser = "";
    #browserVersion = "";
    #os = "";

    constructor( {date, ip, region, browser, browserVersion, os} ) {
        this.#date = date | null;
        this.#ip = ip | null;
        this.#region = region | "";
        this.#browser = browser | "";
        this.#browserVersion = browserVersion | "";
        this.#os = os | "";
    }

    getStatArray() {
        return [this.#date, this.#ip, this.#region, this.#browser, this.#browserVersion, this.#os];
    }
}