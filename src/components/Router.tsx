import {Route, Routes} from "react-router-dom";
import Stat from "./Stat";
import LocalStorageController from "../service/LocalStorageController";
import App from "./App";
import {useEffect, useState} from "react";
import Data from "../models/Data";


function Router() {
    const [urlData] = useState<(Data | null)[]>(() => {
        return LocalStorageController.getUrlData();
    })

    useEffect(() => {
        const validUrlData = urlData.filter(url => url !== null);
        LocalStorageController.saveUrlData(validUrlData);
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