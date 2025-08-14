import IpInfo from "./IpInfo";
import UserStatistic from "../models/UserStatistic";
import {IResult, UAParser} from "ua-parser-js";
import { format } from "date-fns";

export default class DataMiner {

    static async getUserStatisticData() {
        const ipInfo = new IpInfo();
        const ipData: {ip: string, region: string} | null = await ipInfo.getIpInfo();

        const uaParser = new UAParser();
        const uaData: IResult = uaParser.getResult();

        if (ipData) {
            const now = new Date();
            const formatedNow: string = format(now, "dd.MM.yyyy HH:mm:ss (SSS 'ms')");
            return new UserStatistic({
                date: formatedNow,
                ip: ipData.ip,
                region: ipData.region,
                browser: uaData.browser.name,
                browserVersion: uaData.browser.version,
                os: uaData.os.name
            });
        }
    }
}