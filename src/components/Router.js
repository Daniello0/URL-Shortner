import {Route, Routes} from "react-router-dom";
import Stat from "./Stat";
import LocalStorageController from "../service/LocalStorageController";
import App from "./App";


function Router() {
    let localStorageData = LocalStorageController.getUrlDataFromLocalStorage()
    return (
        <div className="router">
            <Routes>
                <Route path="/" element={<App />} />
                {localStorageData.map(data => {
                    return (
                        <Route path={`/stat${data.statUrl.pathname}`} element={<Stat data={data} />} />
                    )
                })}

                <Route path="*" element={<h1>Страница не найдена (404)</h1>} />
            </Routes>
        </div>
    )
}

export default Router;