const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.post('/api/add', (req, res) => {
    const { url, shortUrlIndex, userStatistic } = req.body;
    const data = { url, shortUrlIndex, userStatistic };
    console.log("Данные с клиента получены:\n", JSON.stringify(data, null, 2));

    res.send("Данные успешно получены на сервере!");
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Привет от бэкенда! Все работает.' });
});

app.listen(PORT, () => {
    console.log(`Бэкенд-сервер запущен на http://localhost:${PORT}`);
});
