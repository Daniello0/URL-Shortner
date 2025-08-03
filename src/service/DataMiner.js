import IpInfo from "./IpInfo";
import UserStatistic from "../models/UserStatistic";
import { UAParser } from "ua-parser-js";

export default class DataMiner {

    async getUserStatisticData() {
        const ipInfo = new IpInfo();
        const ipData = await ipInfo.getIpInfo();

        const uaParser = new UAParser();
        const uaData = uaParser.getResult();

        if (ipData) {
            return new UserStatistic({
                data: new Date().toISOString(),
                ip: ipData.ip,
                region: ipData.region,
                browser: uaData.browser.name,
                browserVersion: uaData.browser.version,
                os: uaData.os.name
            });
        }
    }
}