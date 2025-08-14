import {useParams} from "react-router-dom";
import ServerController from "../service/ServerController";
import Link from "../models/Link";
import DataMiner from "../service/DataMiner";
import UserStatistic from "../models/UserStatistic";


function ShortUrlRedirect() {
    type StatParam = {
        shortCode: string;
    }
    const { shortCode } = useParams<StatParam>();
    console.log(shortCode);

    const getUserStatisticData = async () => {
        const dataMiner = new DataMiner();
        const stat = await dataMiner.getUserStatisticData();
        console.log(stat);
        return stat;
    }

    const addUserStatisticToDB = async (link: Link, stat: UserStatistic) => {
        await ServerController.addDehydratedUserStatisticToLinkInDB(link.shortUrlIndex, stat);
    }

    if (shortCode) {
        ServerController.getHydratedLinkFromDB(shortCode).then((link: Link | undefined) => {
            console.log(link);
            if (link) {
                getUserStatisticData().then((stat: UserStatistic | undefined) => {
                    if (!stat)
                        return;

                    addUserStatisticToDB(link, stat).then(() => {
                        const href = link.url.toString();
                        window.location.replace(href);
                    });
                });
            } else {
                console.log("Не удалось найти ссылку: ", link);
            }
        });
    }

    return (
        <div>
            Загрузка...
        </div>
    )
}

export default ShortUrlRedirect;