import {Route, Routes} from "react-router-dom";
import Stat from "./Stat";
import App from "./App";
import ShortUrlRedirect from "./ShortUrlRedirect";


function Router() {
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