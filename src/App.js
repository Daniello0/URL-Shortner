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
        </div>
    );
}

export default App;