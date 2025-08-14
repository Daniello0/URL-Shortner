import express from 'express';
import cors from 'cors';
import DatabaseController from "./DatabaseController";
import ShortUrlIndexGenerator from "./ShortUrlIndexGenerator";
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
    DatabaseController.createLink({ url, shortUrlIndex }).then(() => {
        res.send("Ответ от сервера: успешно (/database/create)");
    });

});

app.post('/database/readOne', async (req, res) => {
    const {shortUrlIndex} = req.body;
    const response = await DatabaseController.readLink(shortUrlIndex);
    if (response) {
        res.json(response);
    }
})

app.get('/database/readAll', async (_req, res) => {
    const response = await DatabaseController.readLinks();
    if (response) {
        res.json(response);
    }
});

app.post('/database/delete', (req, res) => {
    const {shortUrlIndex} = req.body;
    DatabaseController.deleteLink(shortUrlIndex).then(() => {
        res.send("Ответ от сервера: успешно (/database/delete)");
    })
});

app.post('/database/addUserStatistic', (req, res) => {
    const {shortUrlIndex, userStatistic} = req.body;
    DatabaseController.addUserStatisticToLink(shortUrlIndex, userStatistic).then(() => {
        res.send("Ответ от сервера: успешно (/database/addUserStatistic)");
    });
});

app.post('/database/resetUserStatistic', (req, res) => {
    const {shortUrlIndex} = req.body;
    DatabaseController.resetUserStatisticInLink(shortUrlIndex).then(() => {
        res.send("Ответ от сервера: успешно (/database/resetUserStatistic)");
    });
});

app.get('/generate/shortUrlIndex', (_req, res) => {
    const iteration = async () => {
        const index: string = ShortUrlIndexGenerator.getRandomShortIndex();
        const isDuplicate: boolean | undefined = await DatabaseController.existShortUrlIndex(index);
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

app.get('/checkConnection', (_req, res) => {
    res.sendStatus(204);
});

app.get('/api/test', (_req, res) => {
    res.json({ message: 'Привет от бэкенда! Все работает.' });
});

app.listen(PORT, () => {
    console.log(`Бэкенд-сервер запущен на http://localhost:${PORT}`);
});
