import './App.css';
import {useEffect, useState} from "react";
import Data from "../models/Data";
import LocalStorageController from "../service/LocalStorageController";
import {useNavigate} from "react-router-dom";

function App() {
    const [urlString, setUrlString] = useState('');
    const [error, setErrorMessage] = useState('');

    //Перед получением добавляет типы данных
    const [urlData, setUrlData] = useState(() => {
        return LocalStorageController.getUrlData();
    });

    const navigate = useNavigate();

    // useEffect для сохранения urlDate в localStorage (перед сохранением убирает типы данных)
    useEffect(() => {
        LocalStorageController.saveUrlData(urlData);
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

    const handleStatUrlClick = (data) => {
        return () => {
            navigate(`/stat${data.statUrl.pathname}`);
        }
    }

    const betaHandleAddUrlButtonClick = async () => {
        await handleAddUrlButtonClick();
    }

    const handleAddUrlButtonClick = async () => {


        if (!validateUrlString(urlString)) {
            setErrorMessage("Введите ссылку");
            return;
        }

        try {
            const data = await Data.create(urlString);

            if (!validateData(data)) {
                setErrorMessage("Не удалось создать короткую ссылку");
                return;
            }

            if (urlData.find(urlData => urlData.shortUrl.toString() === data.shortUrl.toString())) {
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

    if (urlData) {
        urlData.sort((a, b) => {
            if (a.shortUrl.toString() < b.shortUrl.toString()) {
                return -1;
            } else if (a.shortUrl.toString() > b.shortUrl.toString()) {
                return 1;
            } else {
                return 0;
            }
        })
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
                <button className="button" onClick={betaHandleAddUrlButtonClick}>
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
                                <a className="url-text" href={data.url.toString()}
                                   target="_blank" rel="noopener noreferrer">
                                    {data.url.toString()}
                                </a>
                            </div>
                            <div className="column-short-url">
                                <div className="url-text" role="link"
                                     onClick={addUserStatisticToData(data)}>
                                    {data.shortUrl.toString()}
                                </div>
                            </div>
                            <div className="column-stats">
                                <div onClick={handleStatUrlClick(data)}
                                   className="stats-link">
                                    {data.statUrl.toString()}
                                </div>
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