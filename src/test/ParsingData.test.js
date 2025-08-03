import UAParser from "ua-parser-js";
import IpInfo from "../../IpInfo";

describe('UserAgent', () => {
    test("Тестирование работы UserAgent", () => {
        const userAgent = navigator.userAgent;
        console.log("Данные от User-Agent: " + userAgent);


        // Более простой способ - через "ua-parser-js"
        const parser = new UAParser();
        const result = parser.getResult();
        console.log(result);
    })
})

describe('getIP', () => {
    test("получение IP адреса", async () => {
        let data;
        let ipInfo = new IpInfo();
        data = await ipInfo.getIpInfo();
        if (data) {
            console.log(data);
        }
    })
})