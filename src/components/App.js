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

    useEffect(() => {
        let timerId;
        if (error) {
            timerId = setTimeout(() => {
                setErrorMessage("");
            }, 2000);
        }

        return () => clearTimeout(timerId);
    }, [error]);

    function validateUrlString(urlString) {
        return urlString;
    }

    function addDataToUrlData(data) {
        setUrlData(prevState => [...prevState, data]);
    }

    function removeDataFromUrlData(data) {
        setUrlData(prevState => prevState.filter(urlData => urlData.shortUrl.toString() !== data.shortUrl.toString()));
    }

    function validateData(data) {
        return data !== null;
    }

    const handleDeleteButtonPressed = (data) => {
        return () => {
            removeDataFromUrlData(data);
        }
    }

    const handleCutUrlButtonClick = async () => {

        console.log(urlData);

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
                addDataToUrlData(data);
                // Далее - обработка данных
                // console.log(data.url.toString());
                // console.log(data.shortUrl.toString());
                // console.log(data.statUrl.toString());
                // console.log(data.userStatistic);
            }

            setErrorMessage('');
            setUrlString('');
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

                {urlData.map((data) => {
                    return (
                        <div className="url-row url-row-layout" key={data.shortUrl.toString()}>
                            <div className="column-main-url">
                                <a className="original-url-text" href={data.url.toString()}
                                   target="_blank" rel="noopener noreferrer">
                                    {data.url.toString()}
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
                                <button className="delete-button" title="Удалить ссылку"
                                        onClick={handleDeleteButtonPressed(data)}>
                                    Удалить
                                </button>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    );
}

export default App;