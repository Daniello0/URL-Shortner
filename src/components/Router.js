import {Route, Routes} from "react-router-dom";
import Stat from "./Stat";
import LocalStorageController from "../service/LocalStorageController";
import App from "./App";
import {useEffect, useState} from "react";


function Router() {
    const [urlData] = useState(() => {
        return LocalStorageController.getUrlData();
    })

    useEffect(() => {
        LocalStorageController.saveUrlData(urlData);
    }, [urlData]);

    return (
        <div className="router">
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/stat/:shortCode" element={<Stat />} />
                <Route path="*" element={<h1>Страница не найдена (404, Router)</h1>} />
            </Routes>
        </div>
    )
}

export default Router;