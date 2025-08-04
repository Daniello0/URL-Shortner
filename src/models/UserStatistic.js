export default class UserStatistic {

    #date = null;
    #ip = null;
    #region = "";
    #browser = "";
    #browserVersion = "";
    #os = "";

    constructor( {date, ip, region, browser, browserVersion, os} ) {
        this.#date = date || "Не определено";
        this.#ip = ip || "Не определено";
        this.#region = region || "Не определено";
        this.#browser = browser || "Не определено";
        this.#browserVersion = browserVersion || "Не определено";
        this.#os = os || "Не определено";
    }

    getStatObj() {
        return {
            date: this.#date,
            ip: this.#ip,
            region: this.#region,
            browser: this.#browser,
            browserVersion: this.#browserVersion,
            os: this.#os
        }
    }
}