import {useEffect} from "react";
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
        const stat = await DataMiner.getUserStatisticData();
        console.log(stat);
        return stat;
    }

    const addUserStatisticToDB = async (link: Link, stat: UserStatistic) => {
        await ServerController.addDehydratedUserStatisticToLinkInDB(link.shortUrlIndex, stat);
    }

    useEffect(() => {
        if (!shortCode) return;

        // Защита от двойного запуска (StrictMode/быстрые обновления)
        const key = `redirect_stat_${shortCode}`;
        const now = Date.now();
        const last = Number(sessionStorage.getItem(key) || "0");
        if (now - last < 10) {
            return;
        }
        sessionStorage.setItem(key, String(now));

        ServerController.getHydratedLinkFromDB(shortCode).then((link: Link | undefined) => {
            console.log(link);
            if (link) {
                getUserStatisticData().then((stat: UserStatistic | undefined) => {
                    if (!stat) {
                        return;
                    }

                    addUserStatisticToDB(link, stat).then(() => {
                        const href = link.url.toString();
                        window.location.replace(href);
                    });
                });
            } else {
                console.log("Не удалось найти ссылку: ", link);
            }
        });
    }, [shortCode]);

    return (
        <div>
            Загрузка...
        </div>
    )
}

export default ShortUrlRedirect;