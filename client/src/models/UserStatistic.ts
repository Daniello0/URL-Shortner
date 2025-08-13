export interface UserStatisticInterface {
    date: string;
    ip: string;
    region: string;
    browser: string | undefined;
    browserVersion: string | undefined;
    os: string | undefined;
}

export default class UserStatistic {

    date: string = "";
    ip: string = "";
    region: string = "";
    browser: string = "";
    browserVersion: string = "";
    os: string = "";

    constructor( {date, ip, region, browser, browserVersion, os}: UserStatisticInterface ) {
        this.date = date || "Не определено";
        this.ip = ip || "Не определено";
        this.region = region || "Не определено";
        this.browser = browser || "Не определено";
        this.browserVersion = browserVersion || "Не определено";
        this.os = os || "Не определено";
    }

    getStatObj(): UserStatisticInterface {
        return {
            date: this.date,
            ip: this.ip,
            region: this.region,
            browser: this.browser,
            browserVersion: this.browserVersion,
            os: this.os
        }
    }
}