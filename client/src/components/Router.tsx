import {Route, Routes} from "react-router-dom";
import Stat from "./Stat";
import LocalStorageController from "../service/LocalStorageController";
import App from "./App";
import ShortUrlRedirect from "./ShortUrlRedirect";
import {useEffect, useState} from "react";
import Link from "../models/Link";


function Router() {
    const [links] = useState<(Link)[]>(() => {
        return LocalStorageController.getLinks();
    })

    useEffect(() => {
        LocalStorageController.saveLinks(links);
    }, [links]);

    return (
        <div className="router">
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/stat/:shortCode" element={<Stat />} />
                <Route path="/:shortCode" element={<ShortUrlRedirect />} />
                <Route path="*" element={<h1>Страница не найдена (404, Router)</h1>} />
            </Routes>
        </div>
    )
}

export default Router;