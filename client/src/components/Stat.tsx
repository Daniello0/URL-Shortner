import "./Stat.css"
import {useEffect, useState} from "react";
import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import LocalStorageController from "../service/LocalStorageController";
import Link from "../models/Link";


function Stat() {
    const navigate: NavigateFunction = useNavigate();

    type StatParam = {
        shortCode: string;
    }
    const { shortCode } = useParams<StatParam>();

    const [link, setLink] = useState<Link | null>(null);

    useEffect(() => {
        if (!shortCode) return;

        const allLinks: (Link)[] = LocalStorageController.getLinks();
        const statUrlPath = '/' + shortCode;

        const foundLink: Link | undefined = allLinks.find(item => item.statUrl.pathname === statUrlPath);

        if (foundLink) {
            setLink(foundLink);
        } else {
            console.error("Данные для этого кода не найдены:", statUrlPath);
        }
    }, [shortCode]);

    function handleBackButtonClick() {
        return () => {
            navigate("/");
        }
    }

    function handleResetButtonClick() {
        return () => {
            if (!link) return;

            const allLinks: (Link)[] = LocalStorageController.getLinks();
            const updatedLinks: (Link)[] = allLinks.map((item: Link) => {
                    if (item.shortUrl.toString() === link.shortUrl.toString()) {
                        return new Link(item.url, item.shortUrl, item.statUrl, []);
                    }
                    return item;
            });

            LocalStorageController.saveLinks(updatedLinks);
            setLink(updatedLinks.find((item: Link) => item.shortUrl.toString() === link.shortUrl.toString()) || null);
        }
    }

    if (!link) {
        return <div className="stat-loading">Загрузка статистики...</div>;
    }

    return (
        <div className="stat">
            <div className="error-container"></div>
            <div className="stats-container">
                <div className="stats-header stat-row-layout">
                    <div className="column-date-stat">Дата</div>
                    <div className="column-ip-stat">IP</div>
                    <div className="column-region-stat">Регион</div>
                    <div className="column-browser-stat">Браузер</div>
                    <div className="column-browser-version-stat">Версия браузера</div>
                    <div className="column-os-stat">ОС</div>
                </div>

                {link.userStatistic.map(statistic => {
                    return (
                        <div className="stat-row stat-row-layout" key={statistic.date}>
                            <div className="column-date-stat">{statistic.date}</div>
                            <div className="column-ip-stat">{statistic.ip}</div>
                            <div className="column-region-stat">{statistic.region}</div>
                            <div className="column-browser-stat">{statistic.browser}</div>
                            <div className="column-browser-version-stat">{statistic.browserVersion}</div>
                            <div className="column-os-stat">{statistic.os}</div>
                        </div>
                        )
                })}

                <div className="button-container">
                    <button className="button-back" onClick={handleBackButtonClick()}>Назад</button>
                    <button className="button-reset" onClick={handleResetButtonClick()}>Сброс</button>
                </div>
            </div>
        </div>
    )
}

export default Stat;