export interface PlainUserStatistic {
    date: string;
    ip: string;
    region: string;
    browser: string;
    browserVersion: string;
    os: string;
}

export interface PlainLink {
    url: string | "";
    shortUrlIndex: string | "";
    userStatistic: PlainUserStatistic[];
}