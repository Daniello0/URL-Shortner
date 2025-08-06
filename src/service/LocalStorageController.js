import UserStatistic from "../models/UserStatistic";
import Data from "../models/Data";

export default class LocalStorageController {
    static getUrlData() {
        try {
            const savedUrlDataString = localStorage.getItem('urlData');

            if (!savedUrlDataString) {
                return [];
            }

            const plainObjectArray = JSON.parse(savedUrlDataString);
            return plainObjectArray.map((plainObj) => {
                const hydratedStats = plainObj.userStatistic.map(statObj => {
                    return new UserStatistic({
                        date: statObj.date,
                        ip: statObj.ip,
                        region: statObj.region,
                        browser: statObj.browser,
                        browserVersion: statObj.browserVersion,
                        os: statObj.os
                    });
                });

                return new Data(
                    new URL(plainObj.url),
                    new URL(plainObj.shortUrl),
                    new URL(plainObj.statUrl),
                    hydratedStats
                );
            });
        } catch (error) {
            console.log("Ошибка при чтении или гидратации urlData из localStorage:", error);
            localStorage.removeItem("urlData");
            return [];
        }
    }

    static saveUrlData(urlData) {
        try {
            const dataToSave = urlData.map(data => {
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