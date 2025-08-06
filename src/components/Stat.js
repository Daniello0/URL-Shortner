import './Stat.css'
import LocalStorageController from "../service/LocalStorageController";


function Stat( {statUrlString } ) {

    const getUrlData = () => {
        return LocalStorageController.getUrlDataFromLocalStorage();
    };

    return (
        <div className="stat">
            <div className="error-container"></div>
            <div className="stats-container">
                <div className="stats-header">
                    <div className="column-date-stat">Дата</div>
                    <div className="column-ip-stat">IP</div>
                    <div className="column-region-stat">Регион</div>
                    <div className="column-browser-stat">Браузер</div>
                    <div className="column-browser-version-stat">Версия браузера</div>
                    <div className="column-os-stat">ОС</div>
                </div>
            </div>
            <button className="back-button">Назад</button>
        </div>
    )
}

export default Stat;