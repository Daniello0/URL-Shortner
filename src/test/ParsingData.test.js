import UAParser from "ua-parser-js";

describe('UserAgent', () => {
    test("Тестирование работы UserAgent", () => {
        const userAgent = navigator.userAgent;
        console.log("Данные от User-Agent: " + userAgent);

        const parser = new UAParser();

        const result = parser.getResult();
        console.log(result);
    })
})

describe('getIP', () => {

})