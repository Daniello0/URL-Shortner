class ServerController {
    static async sendData() {
        console.log("Формирование запроса на сервер");
        try {
            const response = await fetch("http://localhost:3001/api/add", {
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
}

ServerController.sendData();
