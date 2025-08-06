import './Stat.css'
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import LocalStorageController from "../service/LocalStorageController";
import Data from "../models/Data";


function Stat() {
    const navigate = useNavigate();

    const { shortCode } = useParams();
    const statUrlString = '/' + shortCode;

    console.log(statUrlString);

    const [data, setData] = useState(null);

    useEffect(() => {
        const allUrlData = LocalStorageController.getUrlData();
        const statUrlPath = '/' + shortCode;

        const foundData = allUrlData.find(item => item.statUrl.pathname === statUrlPath);

        if (foundData) {
            setData(foundData);
        } else {
            console.error("Данные для этого кода не найдены:", statUrlPath);
        }
    }, [shortCode]);

    console.log(data);

    function handleBackButtonClick() {
        return () => {
            navigate("/");
        }
    }

    function handleResetButtonClick() {
        return () => {
            if (!data) return;

            const allUrlData = LocalStorageController.getUrlData();
            const updatedUrlData = allUrlData.map(item => {
                if (item.shortUrl.toString() === data.shortUrl.toString()) {
                    return new Data(item.url, item.shortUrl, item.statUrl, []);
                }
                return item;
            });

            LocalStorageController.saveUrlData(updatedUrlData);
            setData(updatedUrlData.find(item => item.shortUrl.toString() === data.shortUrl.toString()));
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