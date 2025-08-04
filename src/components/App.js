import './App.css';
import {useEffect, useState} from "react";
import Data from "../models/Data";
import UserStatistic from "../models/UserStatistic";

function App() {
    const [urlString, setUrlString] = useState('');
    const [error, setErrorMessage] = useState('');
    const [urlData, setUrlData] = useState(() => {
        try {
            const savedUrlDataString = localStorage.getItem('urlData');

            if (!savedUrlDataString) {
                return [];
            }

            const plainObjectArray = JSON.parse(savedUrlDataString);
            return plainObjectArray.map((plainObj) => {
                const hydratedStats = plainObj.userStatistic.map(statObj => {
                    return new UserStatistic({
                        date: statObj.date,
                        ip: statObj.ip,
                        region: statObj.region,
                        browser: statObj.browser,
                        browserVersion: statObj.browserVersion,
                        os: statObj.os
                    });
                });

                return new Data(
                    new URL(plainObj.url),
                    new URL(plainObj.shortUrl),
                    new URL(plainObj.statUrl),
                    hydratedStats
                );
            });
        } catch (error) {
            console.log("Ошибка при чтении или гидратации urlData из localStorage:", error);
            localStorage.removeItem("urlData");
            return [];
        }
    });

    // useEffect для сохранения urlDate в localStorage
    useEffect(() => {
        try {
            const dataToSave = urlData.map(data => {
                return {
                    url: data.url.toString(),
                    shortUrl: data.shortUrl.toString(),
                    statUrl: data.statUrl.toString(),

                    userStatistic: data.userStatistic.map(stat => {
                        return {
                            date: stat.date,
                            ip: stat.ip,
                            region: stat.region,
                            browser: stat.browser,
                            browserVersion: stat.browserVersion,
                            os: stat.os,
                        }
                    })
                }
            });

            localStorage.setItem('urlData', JSON.stringify(dataToSave));
        } catch (error) {
            console.log("Ошибка при сохранении urlData в localStorage: ", error);
        }
    }, [urlData]);

    function validateUrlString(urlString) {
        return urlString;
    }

    function validateData(data) {
        return data !== null;
    }

    const handleCutUrlButtonClick = async () => {
        if (!validateUrlString(urlString)) {
            console.log("Введите ссылку");
            setErrorMessage("Введите ссылку");
            return;
        }

        try {
            const data = await Data.create(urlString);

            if (!validateData(data)) {
                console.log("Не удалось создать короткую ссылку");
                setErrorMessage("Не удалось создать короткую ссылку");
                return;
            }

            if (data) {
                data.addUserStatistic();
                setUrlData(prevState => [...prevState, data]);
                // Далее - обработка данных
                // console.log(data.url.toString());
                // console.log(data.shortUrl.toString());
                // console.log(data.statUrl.toString());
                // console.log(data.userStatistic);
                console.log("urlData из localStorage после добавления:\n", urlData);
            }

            setErrorMessage('');
        } catch (error) {
            console.log("Не удалось создать короткую ссылку", error);
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
                    value={urlString}
                    onChange={(e) => setUrlString(e.target.value)}
                />
                <button className="button" onClick={handleCutUrlButtonClick}>
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

                {urlData.map((data, index) => {
                    return (
                        <div className="url-row url-row-layout" key={index}>
                            <div className="column-main-url">
                                <a className="original-url-text" href={data.url.toString()}
                                   target="_blank" rel="noopener noreferrer">
                                    {data.url.origin}
                                </a>
                            </div>
                            <div className="column-short-url">
                                <a href={data.shortUrl.toString()} target="_blank" rel="noopener noreferrer">
                                    {data.shortUrl.toString()}
                                </a>
                            </div>
                            <div className="column-stats">
                                <a href={data.statUrl.toString()} target="_blank" rel="noopener noreferrer" className="stats-link">
                                    {data.statUrl.toString()}
                                </a>
                            </div>
                            <div className="column-action">
                                <button className="delete-button" title="Удалить ссылку" id={data.shortUrl.toString()}>
                                    Удалить
                                </button>
                            </div>
                        </div>
                    )
                })}

                {/* ТЕСТОВАЯ СТРОКА 1 */}
                <div className="url-row url-row-layout">
                    <div className="column-main-url">
                        <a className="original-url-text" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                           target="_blank" rel="noopener noreferrer">
                            https://www.youtube.com/watch?v=dQw4w9WgXcQ (test)
                        </a>
                    </div>
                    <div className="column-short-url">
                        <a href="https://clck.ru/37BEwD" target="_blank" rel="noopener noreferrer">
                            https://clck.ru/37BEwD (test)
                        </a>
                    </div>
                    <div className="column-stats">
                        <a href="https://clck.ru/37BEwD+" target="_blank" rel="noopener noreferrer" className="stats-link">
                            Посмотреть (test)
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