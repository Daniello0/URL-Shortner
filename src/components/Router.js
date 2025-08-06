import {Route, Routes} from "react-router-dom";
import App from "./App";
import Stat from "./Stat";


function Router() {
    return (
        <div className="router">
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/stat" element={<Stat />} />
                <Route path="*" element={<h1>Страница не найдена (404)</h1>} />
            </Routes>
        </div>
    )
}

export default Router;