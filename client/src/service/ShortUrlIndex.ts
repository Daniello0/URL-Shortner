export default class ShortUrlIndex {
    static async getShortUrlIndex(): Promise<string> {
        const apiUrl: string = "http://localhost:3001/generate/shortUrlIndex";
        try {
            const response: Response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                console.error("Ошибка соединения:", response.status, response.statusText);
                return "";
            }
            return await response.text();
        } catch (error) {
            console.error("Ошибка парсинга", error);
            return "";
        }
    }
}