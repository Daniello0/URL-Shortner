export default class UrlShortner {
    async getShortUrl(url) {
        let apiUrl = "https://clck.ru/--";
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `url=${encodeURIComponent(url)}`
            });
            if (!response.ok) {
                console.error("Ошибка соединения:", response.status, response.statusText);
                return null;
            }
            return await response.text();
        } catch (error) {
            console.error("Ошибка парсинга", error);
            return null;
        }
    }
}
