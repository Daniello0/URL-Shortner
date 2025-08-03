import './App.css';
import UrlShortner from "../service/UrlShortner";
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
                    placeholder="Введите ссылку"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button className="button" onClick={handleShortenClick}>
                    Добавить
                </button>
            </div>
            <div className="error-container">{error}</div>
            <div className="urls-container">
                <div className="urls-header url-row-layout">
                    <div className="column-main-url">Основная ссылка</div>
                    <div className="column-short-url">Сокращенная ссылка</div>
                    <div className="column-stats">Статистика</div>
                    <div className="column-action">Действие</div>
                </div>

                {/* ТЕСТОВАЯ СТРОКА 1 */}
                <div className="url-row url-row-layout">
                    <div className="column-main-url">
                        <a className="original-url-text" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                           target="_blank" rel="noopener noreferrer">
                            https://www.youtube.com/watch?v=dQw4w9WgXcQ
                        </a>
                    </div>
                    <div className="column-short-url">
                        <a href="https://clck.ru/37BEwD" target="_blank" rel="noopener noreferrer">
                            https://clck.ru/37BEwD
                        </a>
                    </div>
                    <div className="column-stats">
                        <a href="https://clck.ru/37BEwD+" target="_blank" rel="noopener noreferrer" className="stats-link">
                            Посмотреть
                        </a>
                    </div>
                    <div className="column-action">
                        <button className="delete-button" title="Удалить ссылку">
                            Удалить
                        </button>
                    </div>
                </div>

                {/* ТЕСТОВАЯ СТРОКА 2 */}
                <div className="url-row url-row-layout">
                    <div className="column-main-url">
                         <a className="original-url-text" href="https://react.dev/learn"
                            target="_blank" rel="noopener noreferrer">
                            https://react.dev/learn
                        </a>
                    </div>
                    <div className="column-short-url">
                        <a href="https://clck.ru/ABC123" target="_blank" rel="noopener noreferrer">
                            https://clck.ru/ABC123
                        </a>
                    </div>
                    <div className="column-stats">
                        <a href="https://clck.ru/ABC123+" target="_blank" rel="noopener noreferrer" className="stats-link">
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