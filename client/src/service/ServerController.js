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
}

ServerController.createLinkInDB({url: "AHAHA", shortUrlIndex: "LOOOL"});
