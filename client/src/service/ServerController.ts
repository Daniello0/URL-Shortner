import Link from "../models/Link";
import UserStatistic, {UserStatisticInterface} from "../models/UserStatistic";
import {PlainLink, PlainUserStatistic} from "../interfaces/Interfaces";

export default class ServerController {
    static async testPostToServer() {
        console.log("Формирование запроса на сервер");
        try {
            const response = await fetch("http://localhost:3001/database/test", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: "https://www.youtube.com",
                    shortUrlIndex: "34FGF",
                    userStatistic: []
                })
            });

            console.log("Запрос отправлен, ожидаем ответ...");

            if (response.ok) {
                const responseData = await response.text();
                console.log("Ответ от сервера получен:", responseData);
            } else {
                console.error("Ошибка от сервера:", response.status);
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
        }
    }

    static async createLinkInDB({url, shortUrlIndex}: {url: string, shortUrlIndex: string}) {
        console.log("Старт createLinkInDB()");
        try {
            const response = await fetch("http://localhost:3001/database/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    shortUrlIndex: shortUrlIndex,
                })
            });

            if (response.ok) {
                const textResponse = await response.text();
                console.log("Ответ сервера: ", textResponse);
            }
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }

    static async getHydratedLinksFromDB(): Promise<Link[]> {
        console.log("Старт getLinksFromDB");
        try {
            const response: Response = await fetch("http://localhost:3001/database/readAll", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const links: {url: string, shortUrlIndex: string, userStatistic: PlainUserStatistic[]}[] = await response.json();
                return this.hydrateLinks(links);
            } else {
                return [];
            }
        } catch (error) {
            console.log("Ошибка сети: ", error);
            return [];
        }
    }

    static async getHydratedLinkFromDB(shortUrlIndex: string): Promise<Link | undefined> {
        console.log("Старт getLinkFromDB");
        try {
            const response = await fetch("http://localhost:3001/database/readOne", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shortUrlIndex: shortUrlIndex,
                })
            });

            if (response.ok) {
                const link: PlainLink = await response.json();
                return this.hydrateLink(link);
            } else return new Link(new URL(""), "");
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }

    static async deleteLinkFromDB(shortUrlIndex: string) {
        console.log("Старт deleteLinkFromDB");
        try {
            const response = await fetch("http://localhost:3001/database/delete", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shortUrlIndex: shortUrlIndex,
                })
            });

            if (response.ok) {
                const textResponse = await response.text();
                console.log("Ответ сервера: ", textResponse);
            }
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }

    static async addUserStatisticToLinkInDB(shortUrlIndex: string, userStatisticToAdd: UserStatisticInterface) {
        console.log("Старт addUserStatisticToLinkInDB");
        try {
            const response = await fetch("http://localhost:3001/database/addUserStatistic", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shortUrlIndex: shortUrlIndex,
                    userStatistic: userStatisticToAdd
                })
            });

            if (response.ok) {
                const textResponse = await response.text();
                console.log("Ответ сервера: ", textResponse);
            }
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }

    static async resetUserStatisticInLinkInDB(shortUrlIndex: string) {
        console.log("Старт resetUserStatisticInLinkInDB");
        try {
            const response = await fetch("http://localhost:3001/database/resetUserStatistic", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shortUrlIndex: shortUrlIndex,
                })
            });

            if (response.ok) {
                const textResponse = await response.text();
                console.log("Ответ сервера: ", textResponse);
            }
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }

    static hydrateLinks(links: {url: string, shortUrlIndex: string, userStatistic: PlainUserStatistic[]}[]): Link[] {
        return links.map((link: {url: string, shortUrlIndex: string, userStatistic: PlainUserStatistic[]}) => {
            return new Link(
                new URL(link.url),
                link.shortUrlIndex,
                link.userStatistic.map((stat: PlainUserStatistic) => {
                    return new UserStatistic({
                        date: stat.date,
                        ip: stat.ip,
                        region: stat.region,
                        browser: stat.browser,
                        browserVersion: stat.browserVersion,
                        os: stat.os
                    });
                })
            );
        });
    }

    static hydrateLink(link: PlainLink) {
        return new Link(
            new URL(link.url),
            link.shortUrlIndex,
            link.userStatistic.map((stat: PlainUserStatistic) => {
                return new UserStatistic({
                    date: stat.date,
                    ip: stat.ip,
                    region: stat.region,
                    browser: stat.browser,
                    browserVersion: stat.browserVersion,
                    os: stat.os
                })
            })
        );
    }

}