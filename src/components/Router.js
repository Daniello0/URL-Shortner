import {Route, Routes} from "react-router-dom";
import Stat from "./Stat";
import LocalStorageController from "../service/LocalStorageController";
import App from "./App";


function Router() {
    let localStorageData = LocalStorageController.getUrlDataFromLocalStorage()
    let statUrlArray = [];
    localStorageData.forEach(item => {
        statUrlArray.push(item.statUrl);
    })
    return (
        <div className="router">
            <Routes>
                <Route path="/" element={<App />} />
                {statUrlArray.map(statUrl => {
                    return (
                        <Route path={`/stat${statUrl.pathname}`} element={<Stat statUrlString={statUrl.toString()} />} />
                    )
                })}

                <Route path="*" element={<h1>Страница не найдена (404)</h1>} />
            </Routes>
        </div>
    )
}

export default Router;