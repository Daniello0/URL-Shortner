import './App.css';
import {useEffect, useState} from "react";
import Data from "../models/Data";
import LocalStorageController from "../service/LocalStorageController";

function App() {
    const [urlString, setUrlString] = useState('');
    const [error, setErrorMessage] = useState('');

    //Перед получением добавляет типы данных
    const [urlData, setUrlData] = useState(() => {
        return LocalStorageController.getUrlDataFromLocalStorage();
    });

    // useEffect для сохранения urlDate в localStorage (перед сохранением убирает типы данных)
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

            localStorage.setItem('urlData', JSON.stringify(dataToSave, null, 2));
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

    function addUserStatisticToData(data) {
        return () => {
            const addUserStat = async () => {
                await data.addUserStatistic();
            }

            addUserStat().then(() => {
                removeDataFromUrlData(data);
                addDataToUrlData(data);
            });

            window.open(data.statUrl.toString(), '_blank', 'noopener,noreferrer');
        }
    }

    const handleDeleteButtonPressed = (data) => {
        return () => {
            removeDataFromUrlData(data);
        }
    }

    const handleAddUrlButtonClick = async () => {

        //ДЛЯ ТЕСТИРОВАНИЯ
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

            if (urlData.find(urlData => urlData.shortUrl.toString() === data.shortUrl.toString())) {
                console.log("Ссылка уже добавлена в таблицу");
                setErrorMessage("Ссылка уже добавлена в таблицу");
                return;
            }

            if (data) {
                addDataToUrlData(data);
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
                <button className="button" onClick={handleAddUrlButtonClick}>
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
                                <div className="original-url-text" role="link"
                                   onClick={addUserStatisticToData(data)}>
                                    {data.shortUrl.toString()}
                                </div>
                            </div>
                            <div className="column-stats">
                                <a href={"/stat"+data.statUrl.pathname} target="_blank" rel="noopener noreferrer"
                                   className="stats-link">
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