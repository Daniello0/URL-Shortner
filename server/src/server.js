const express = require('express');
const cors = require('cors'); // 1. Импортируем cors
const app = express();
const PORT = 3001;

// 2. Используем middleware cors. Теперь наш сервер разрешает запросы с других доменов.
app.use(cors());

app.get('/api/test', (req, res) => {
    res.json({ message: 'Привет от бэкенда! Все работает.' });
});

app.listen(PORT, () => {
    console.log(`Бэкенд-сервер запущен на http://localhost:${PORT}`);
});
