const express = require('express');
const cors = require('cors');
const DatabaseController = require("./DatabaseController");
const ShortUrlIndexGenerator = require("./ShortUrlIndexGenerator");
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.post('/database/test', (req, res) => {
    const { url, shortUrlIndex, userStatistic } = req.body;
    const data = { url, shortUrlIndex, userStatistic };
    console.log("Данные с клиента получены:\n", JSON.stringify(data, null, 2));

    res.send("Ответ от сервера: успешно (/database/test)");
});

app.post('/database/create', (req, res) => {
    const { url, shortUrlIndex } = req.body;
    const response = DatabaseController.createLink({ url, shortUrlIndex });
    if (response) {
        res.send("Ответ от сервера: успешно (/database/create)");
    }

});

app.post('/database/readOne', async (req, res) => {
    const {shortUrlIndex} = req.body;
    const response = await DatabaseController.readLink(shortUrlIndex);
    if (response) {
        res.json(response);
    }
})

app.get('/database/readAll', async (req, res) => {
    const response = await DatabaseController.readLinks();
    if (response) {
        res.json(response);
    }
});

app.post('/database/delete', (req, res) => {
    const {shortUrlIndex} = req.body;
    const response = DatabaseController.deleteLink(shortUrlIndex)
    if (response) {
        res.send("Ответ от сервера: успешно (/database/delete)");
    }
});

app.post('/database/addUserStatistic', (req, res) => {
    const {shortUrlIndex, userStatistic} = req.body;
    const response = DatabaseController.addUserStatisticToLink(shortUrlIndex, userStatistic);
    if (response) {
        res.send("Ответ от сервера: успешно (/database/addUserStatistic)");
    }
});

app.post('/database/resetUserStatistic', (req, res) => {
    const {shortUrlIndex} = req.body;
    const response = DatabaseController.resetUserStatisticInLink(shortUrlIndex);
    if (response) {
        res.send("Ответ от сервера: успешно (/database/resetUserStatistic)");
    }
});

app.get('/generate/shortUrlIndex', (req, res) => {
    const iteration = async () => {
        const index = ShortUrlIndexGenerator.getRandomShortIndex();
        const isDuplicate = await DatabaseController.existShortUrlIndex(index);
        if (!isDuplicate) {
            return index;
        } else {
            return iteration();
        }
    }

    iteration().then((index) => {
        res.send(index);
    });
});

app.get('/checkConnection', (req, res) => {
    res.send({
        connected: true
    });
})

app.get('/api/test', (req, res) => {
    res.json({ message: 'Привет от бэкенда! Все работает.' });
});

app.listen(PORT, () => {
    console.log(`Бэкенд-сервер запущен на http://localhost:${PORT}`);
});
