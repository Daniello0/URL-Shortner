class IpInfo {
    async getIpInfo(): Promise<object | null> {
        try {
            const response: Response = await fetch("https://ipinfo.io/json");
            if (!response.ok) {
                console.error("Ошибка доступа к серверу");
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log("Ошибка парсинга IP: ", error);
            return null;
        }
    }
}

module.exports = IpInfo;