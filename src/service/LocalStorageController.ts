import UserStatistic from "../models/UserStatistic";
import Link from "../models/Link";

interface PlainUserStatistic {
    date: string;
    ip: string;
    region: string;
    browser: string;
    browserVersion: string;
    os: string;
}

interface PlainData {
    url: string | "";
    shortUrl: string | "";
    statUrl: string | "";
    userStatistic: PlainUserStatistic[];
}

export default class LocalStorageController {
    static getLinks(): Link[] {
        try {
            const savedLinksString: string | null = localStorage.getItem('links');

            if (!savedLinksString) {
                return [];
            }

            const plainObjectArray: PlainData[] = JSON.parse(savedLinksString);
            return plainObjectArray.map((plainObj: PlainData) => {
                const hydratedStats: UserStatistic[] = plainObj.userStatistic.map((statObj: PlainUserStatistic): UserStatistic  => {
                    return new UserStatistic({
                        date: statObj.date,
                        ip: statObj.ip,
                        region: statObj.region,
                        browser: statObj.browser,
                        browserVersion: statObj.browserVersion,
                        os: statObj.os
                    });
                });

                if (plainObj.url && plainObj.shortUrl && plainObj.statUrl) {
                    return new Link(
                        new URL(plainObj.url),
                        new URL(plainObj.shortUrl),
                        new URL(plainObj.statUrl),
                        hydratedStats
                    );
                } else {
                    return new Link(new URL(""), new URL(""), new URL(""))
                }
            });
        } catch (error) {
            console.log("Ошибка при чтении или гидратации links из localStorage:", error);
            localStorage.removeItem("links");
            return [];
        }
    }

    static saveLinks(links: Link[]): void {
        try {
            const dataToSave: (PlainData | null)[]  = links.map((data: Link): PlainData | null => {
                if (!data.url || !data.shortUrl ||  !data.statUrl) {
                    return null;
                }

                return {
                    url: data.url.toString(),
                    shortUrl: data.shortUrl.toString(),
                    statUrl: data.statUrl.toString(),

                    userStatistic: data.userStatistic.map(stat => {
                        return {
                            date: stat.date,
                            ip: stat.ip,
                            region: stat.region,
                            browser: stat.browser,
                            browserVersion: stat.browserVersion,
                            os: stat.os,
                        }
                    })
                }
            });

            localStorage.setItem('links', JSON.stringify(dataToSave, null, 2));
        } catch (error) {
            console.log("Ошибка при сохранении links в localStorage: ", error);
        }
    }
}