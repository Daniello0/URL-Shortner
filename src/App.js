import './App.css';
import UrlShortner from "./UrlShortner";
import {useState} from "react";

function App() {
    const [url, setUrl] = useState('');
    const [error, setErrorMessage] = useState('');

    const handleShortenClick = async () => {
        if (!url) {
            console.log("Введите ссылку");
            setErrorMessage("Введите ссылку")
            return;
        }

        let shorter = new UrlShortner();
        console.log("Ссылка: ", url);

        const shortUrlResult = await shorter.getShortUrl(url);

        if (shortUrlResult) {
            console.log("Короткая ссылка:", shortUrlResult);
            setErrorMessage('');
        } else {
            console.log("Не удалось создать короткую ссылку");
            setErrorMessage("Не удалось создать короткую ссылку");
        }
    }


    return (
        <div className="app">
            <div className="main-container">
                <input
                    type={'url'}
                    className="url-input"
                    placeholder="Put your URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button className="button" onClick={handleShortenClick}>
                    Add
                </button>
            </div>
            <div className="error-container">{error}</div>
            <div className="urls-container">
                <div className="header urls-header">
                    <div className="column-short-urls">Короткая ссылка</div>
                    <div className="column-stat-urls">Статистика</div>
                    <div className="column-action">Действие</div>
                </div>

                <div className="url-row">
                    <div className="column-short-url">
                        <a href="https://clck.ru/37BEwD" target="_blank" rel="noopener noreferrer">
                            https://clck.ru/37BEwD
                        </a>
                    </div>
                    <div className="column-stat-urls">
                        <a href="/stats/37BEwD" className="stats-link">
                            Посмотреть
                        </a>
                    </div>
                    <div className="column-action">
                        <button className="delete-button" title="Удалить ссылку">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;