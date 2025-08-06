import UserStatistic from "../models/UserStatistic";
import Data from "../models/Data";

export default class LocalStorageController {
    static getUrlDataFromLocalStorage() {
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
}