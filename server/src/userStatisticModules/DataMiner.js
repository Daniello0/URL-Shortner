const IpInfo = require("./IpInfo");
const {UAParser} = require("ua-parser-js");

class DataMiner {

    static async getUserStatisticData() {
        const ipInfo = new IpInfo();
        const ipData = await ipInfo.getIpInfo();

        const uaParser = new UAParser();
        const uaData = uaParser.getResult();

        if (ipData) {
            const now = new Date();
            return {
                date: now.toLocaleString(),
                ip: ipData.ip,
                region: ipData.region,
                browser: uaData.browser.name || "Не определено",
                browserVersion: uaData.browser.version || "Не определено",
                os: uaData.os.name || "Не определено"
            };
        }
    }
}

module.exports = DataMiner;