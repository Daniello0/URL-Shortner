import DataMiner from "../service/DataMiner";

describe('Data Miner', () => {
    test('Получение данных от getUserStatisticData()', async () => {
        let data = await DataMiner.getUserStatisticData();
        if (data) {
            console.log(data);
            console.log(data.getStatObj());
            console.log(data.getStatObj().ip);
        }
    })
});