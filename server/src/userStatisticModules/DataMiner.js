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
                browser: uaData.browser.name,
                browserVersion: uaData.browser.version,
                os: uaData.os.name
            };
        }
    }
}

module.exports = DataMiner;