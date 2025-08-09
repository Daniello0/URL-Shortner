import './App.css';
import {useEffect, useState} from "react";
import Link from "../models/Link";
import LocalStorageController from "../service/LocalStorageController";
import {NavigateFunction, useNavigate} from "react-router-dom";

function App() {
    const [urlString, setUrlString] = useState('');
    const [error, setErrorMessage] = useState('');

    //Перед получением добавляет типы данных
    const [links, setLinks] = useState<(Link)[]>(() => {
        return LocalStorageController.getLinks();
    });

    const navigate: NavigateFunction = useNavigate();

    // useEffect для сохранения urlDate в localStorage (перед сохранением убирает типы данных)
    useEffect(() => {
        LocalStorageController.saveLinks(links);
    }, [links]);

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        if (error) {
            timerId = setTimeout(() => {
                setErrorMessage("");
            }, 2000);
        }

        return () => clearTimeout(timerId);
    }, [error]);

    function validateUrlString(urlString: string) {
        return urlString;
    }

    function addDataToLinks(data: Link): void {
        setLinks(prevState => [...prevState, data]);
    }

    function removeDataFromLinks(data: Link): void {
        setLinks((prevState: Link[]) => prevState.filter((link: Link) =>
            link.shortUrl.toString() !== data.shortUrl.toString()));
    }

    function addUserStatisticToData(data: Link) {
        return () => {
            const addUserStat = async () => {
                await data.addUserStatistic();
            }

            addUserStat().then(() => {
                removeDataFromLinks(data);
                addDataToLinks(data);
            });

            if (data.statUrl) {
                window.open(data.statUrl.toString(), '_blank', 'noopener,noreferrer');
            }
        }
    }

    const handleDeleteButtonPressed = (data: Link) => {
        return () => {
            removeDataFromLinks(data);
        }
    }

    const handleStatUrlClick = (data: Link) => {
        return () => {
            if (data.statUrl) {
                navigate(`/stat${data.statUrl.pathname}`);
            }
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
            const data: Link = await Link.create(urlString);

            if (links.find((link: Link) =>
                link.shortUrl.toString() === data.shortUrl.toString())) {
                setErrorMessage("Ссылка уже добавлена в таблицу");
                return;
            }

            if (data) {
                addDataToLinks(data);
            }

            setErrorMessage('');
            setUrlString('');
        } catch (error) {
            setErrorMessage("Не удалось создать короткую ссылку");
        }
    }

    if (links) {
        links.sort((a: Link, b: Link) => {
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

                {links.map((data) => {
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