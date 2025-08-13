import './App.css';
import {useEffect, useState} from "react";
import Link from "../models/Link";
import LocalStorageController from "../service/LocalStorageController";
import {NavigateFunction, useNavigate} from "react-router-dom";
import ServerController from "../service/ServerController";
import DataMiner from "../service/DataMiner";
import UserStatistic from "../models/UserStatistic";

function App() {
    const [urlString, setUrlString] = useState('');
    const [error, setErrorMessage] = useState('');

    //Перед получением добавляет типы данных
    const [links, setLinks] = useState<(Link)[]>(() => {
        const getLinks = async () => {
            return await ServerController.getHydratedLinksFromDB();
        };
        getLinks().then((links: Link[]) => {
            setLinks(links);
        });
        return [];
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

    async function addDataToLinks(data: Link): Promise<void> {
        await ServerController.createLinkInDB({url: data.url.toString(), shortUrlIndex: data.shortUrlIndex});
        setLinks(links => [...links, data]);
        // setLinks(prevState => [...prevState, data]);
    }

    async function removeDataFromLinks(data: Link): Promise<void> {
        await ServerController.deleteLinkFromDB(data.shortUrlIndex);
        setLinks((prevState: Link[]) => prevState.filter((link: Link) =>
            link.shortUrlIndex !== data.shortUrlIndex));
    }

    function addUserStatisticToData(data: Link) {
        return () => {

        }
        /*return () => {
            const addUserStat = async () => {
                await data.addUserStatistic();
            }

            addUserStat().then(() => {
                removeDataFromLinks(data);
                addDataToLinks(data);
            });

            if (data.shortUrlIndex) {
                window.open(data.shortUrlIndex, '_blank', 'noopener,noreferrer');
            }
        }*/

        /*return async () => {
            let newUserStatistic = new UserStatistic({ip: "Не определено", date: "Не определено", os: "Не определено",
                browser: "Не определено", browserVersion: "Не определено", region: "Не определено"});
            await new DataMiner().getUserStatisticData().then((userStat: UserStatistic | undefined) => {
                if (!userStat) {
                    return;
                }
                newUserStatistic.ip = userStat?.ip || "";
                newUserStatistic.browser = userStat?.browser || "";
                newUserStatistic.browserVersion = userStat?.browserVersion || "";
                newUserStatistic.os = userStat?.os || "";
                newUserStatistic.region = userStat?.region || "";
                newUserStatistic.date = userStat?.date || "";
            });
            await ServerController.addUserStatisticToLinkInDB(data.shortUrlIndex, newUserStatistic);
            if (data.shortUrlIndex) {
                window.open(data.shortUrlIndex, '_blank', 'noopener,noreferrer');
            }
        }*/
    }

    const handleDeleteButtonPressed = (data: Link) => {
        return async () => {
            await removeDataFromLinks(data);
        }
    }

    const handleStatUrlClick = (data: Link) => {
        return () => {
            if (data.shortUrlIndex) {
                navigate(`/stat/${data.shortUrlIndex}`);
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

            if (data) {
                await addDataToLinks(data);
            }

            setErrorMessage('');
            setUrlString('');
        } catch (error) {
            setErrorMessage("Не удалось создать короткую ссылку");
        }
    }

    if (links) {
        links.sort((a: Link, b: Link) => {
                if (a.shortUrlIndex < b.shortUrlIndex) {
                    return -1;
                } else if (a.shortUrlIndex > b.shortUrlIndex) {
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
                        <div className="url-row url-row-layout" key={data.shortUrlIndex}>
                            <div className="column-main-url">
                                <a className="url-text" href={data.url.toString()}
                                   target="_blank" rel="noopener noreferrer">
                                    {data.url.toString()}
                                </a>
                            </div>
                            <div className="column-short-url">
                                <div className="url-text" role="link"
                                     onClick={addUserStatisticToData(data)}>
                                    {data.shortUrlIndex}
                                </div>
                            </div>
                            <div className="column-stats">
                                <div onClick={handleStatUrlClick(data)}
                                   className="stats-link">
                                    {data.shortUrlIndex}
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