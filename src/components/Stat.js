import './Stat.css'
import LocalStorageController from "../service/LocalStorageController";


function Stat( {statUrlString } ) {

    const getUrlData = () => {
        return LocalStorageController.getUrlDataFromLocalStorage();
    };

    return (
        <div>
            Мы на странице Stat!{<br />}
            {statUrlString}{<br />}
            {JSON.stringify(getUrlData(), null, 0)}
        </div>
    )
}

export default Stat;