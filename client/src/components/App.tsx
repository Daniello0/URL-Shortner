import './App.css';
import {useEffect, useState} from "react";
import Link from "../models/Link";
import {NavigateFunction, useNavigate} from "react-router-dom";
import ServerController from "../service/ServerController";

function App() {
    const [urlString, setUrlString] = useState('');
    const [error, setErrorMessage] = useState('');
    const [isServerConnected, setIsServerConnected] = useState(false);

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
        let timerId: NodeJS.Timeout | undefined;
        if (error) {
            timerId = setTimeout(() => {
                setErrorMessage("");
            }, 2000);
        }

        return () => clearTimeout(timerId);
    }, [error]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const ok = await ServerController.checkConnection();
            if (mounted) setIsServerConnected(ok);
        })();

        return () => {
            mounted = false;
        };
    }, []);


    function validateUrlString(urlString: string) {
        return urlString;
    }

    async function addDataToLinks(data: Link): Promise<void> {
        await ServerController.createLinkInDB({url: data.url.toString(), shortUrlIndex: data.shortUrlIndex});
        setLinks(links => [...links, data]);
    }

    async function removeDataFromLinks(data: Link): Promise<void> {
        await ServerController.deleteLinkFromDB(data.shortUrlIndex);
        setLinks((prevState: Link[]) => prevState.filter((link: Link) =>
            link.shortUrlIndex !== data.shortUrlIndex));
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

    const handleShortUrlClick = (data: Link) => {
        return () => {
            if (data.shortUrlIndex) {
                window.open(window.location.origin + "/" + data.shortUrlIndex, "_blank", "noopener,noreferrer");
            }
        }
    }

    const handleAddUrlButtonClick = async () => {
        if (!isServerConnected) {
            setErrorMessage('Не удалось подключиться к серверу');
            return;
        }

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
                                onClick={handleShortUrlClick(data)}>
                                    {window.location.origin + "/" + data.shortUrlIndex}
                                </div>
                            </div>
                            <div className="column-stats">
                                <div onClick={handleStatUrlClick(data)}
                                   className="stats-link">
                                    {window.location.origin + "/stat/" + data.shortUrlIndex}
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