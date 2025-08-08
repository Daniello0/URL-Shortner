import UserStatistic from "../models/UserStatistic";
import Data from "../models/Data";

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
    static getUrlData(): Data[] {
        try {
            const savedUrlDataString: string | null = localStorage.getItem('urlData');

            if (!savedUrlDataString) {
                return [];
            }

            const plainObjectArray: PlainData[] = JSON.parse(savedUrlDataString);
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
                    return new Data(
                        new URL(plainObj.url),
                        new URL(plainObj.shortUrl),
                        new URL(plainObj.statUrl),
                        hydratedStats
                    );
                } else {
                    return new Data(new URL(""), new URL(""), new URL(""))
                }
            });
        } catch (error) {
            console.log("Ошибка при чтении или гидратации urlData из localStorage:", error);
            localStorage.removeItem("urlData");
            return [];
        }
    }

    static saveUrlData(urlData: Data[]): void {
        try {
            const dataToSave: (PlainData | null)[]  = urlData.map((data: Data): PlainData | null => {
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

            localStorage.setItem('urlData', JSON.stringify(dataToSave, null, 2));
        } catch (error) {
            console.log("Ошибка при сохранении urlData в localStorage: ", error);
        }
    }
}