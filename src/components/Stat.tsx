import "./Stat.css"
import {useEffect, useState} from "react";
import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import LocalStorageController from "../service/LocalStorageController";
import Data from "../models/Data";


function Stat() {
    const navigate: NavigateFunction = useNavigate();

    type StatParam = {
        shortCode: string;
    }
    const { shortCode } = useParams<StatParam>();

    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        if (!shortCode) return;

        const allUrlData: (Data | null)[] = LocalStorageController.getUrlData();
        const statUrlPath = '/' + shortCode;

        const validUrlData: Data[] = allUrlData.filter((item): item is Data => item !== null);

        const foundData: Data | undefined = validUrlData.find(item => item && item.statUrl && item.statUrl.pathname === statUrlPath);

        if (foundData) {
            setData(foundData);
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
            if (!data) return;

            const allUrlData: (Data | null)[] = LocalStorageController.getUrlData();
            const updatedUrlData: (Data | undefined)[] = allUrlData.map((item: Data | null) => {
                if (item && item.shortUrl && data.shortUrl) {
                    if (item.shortUrl.toString() === data.shortUrl.toString()) {
                        return new Data(item.url, item.shortUrl, item.statUrl, []);
                    }
                    return item;
                }
                return undefined;
            });

            const validUpdatedUrlData = updatedUrlData.filter((item): item is Data => item !== null);
            LocalStorageController.saveUrlData(validUpdatedUrlData);
            setData(validUpdatedUrlData.find(item => item.shortUrl && data.shortUrl && item.shortUrl.toString() === data.shortUrl.toString()) || null);
        }
    }

    if (!data) {
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

                {data.userStatistic.map(statistic => {
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