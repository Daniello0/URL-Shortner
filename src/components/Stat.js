import './Stat.css'
import {useEffect} from "react";


function Stat( {data } ) {

    useEffect(() => {
        console.log(data)
    }, [data])

    function handleButtonBackClick() {
        window.open("/", "_self");
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

                <div className="button-back-container">
                    <button className="button-back" onClick={() => {handleButtonBackClick()}}>Назад</button>
                </div>
            </div>
        </div>
    )
}

export default Stat;