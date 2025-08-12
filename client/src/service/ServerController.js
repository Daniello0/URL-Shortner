class ServerController {
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

    static async createLinkInDB({url, shortUrlIndex}) {
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

    static async getLinksFromDB() {
        console.log("Старт getLinksFromDB");
        try {
            const response = await fetch("http://localhost:3001/database/read", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const links = await response.json();
                console.log("Полученные данные на клиенте: ", links);
                console.log("Часть данных: ", links[0].url);
            }
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }

    static async deleteLinkFromDB({url, shortUrlIndex}) {
        console.log("Старт deleteLinkFromDB");
        try {
            const response = await fetch("http://localhost:3001/database/delete", {
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
                const textResponse = response.text();
                console.log("Ответ сервера: ", textResponse);
            }
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }

    static async addUserStatisticToLinkInDB(shortUrlIndex) {
        console.log("Старт addUserStatisticToLinkInDB");
        try {
            const response = await fetch("http://localhost:3001/database/addUserStatistic", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shortUrlIndex: shortUrlIndex,
                })
            });

            if (response.ok) {
                const textResponse = response.text();
                console.log("Ответ сервера: ", textResponse);
            }
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }
}

ServerController.addUserStatisticToLinkInDB("34FGT");