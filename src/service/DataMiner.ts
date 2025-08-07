import IpInfo from "./IpInfo";
import UserStatistic from "../models/UserStatistic";
import {IResult, UAParser} from "ua-parser-js";

export default class DataMiner {

    async getUserStatisticData() {
        const ipInfo = new IpInfo();
        const ipData: {ip: string, region: string} | null = await ipInfo.getIpInfo();

        const uaParser = new UAParser();
        const uaData: IResult = uaParser.getResult();

        if (ipData) {
            const now = new Date();
            return new UserStatistic({
                date: now.toLocaleString(),
                ip: ipData.ip,
                region: ipData.region,
                browser: uaData.browser.name,
                browserVersion: uaData.browser.version,
                os: uaData.os.name
            });
        }
    }
}