import {PrismaClient} from "../src/generated/prisma";
const prisma = new PrismaClient();

export default class DatabaseController {
    static async createLink({url, shortUrlIndex}: {url: string, shortUrlIndex: string}) {
        await prisma.noUsersTable.create({
            data: {
                url: url,
                shortUrlIndex: shortUrlIndex,
                userStatistic: []
            }
        })
    }

    static async readLinks() {
        try {
            return await prisma.noUsersTable.findMany()
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }

    static async readLink(shortUrlIndex: string) {
        try {
            return await prisma.noUsersTable.findFirst({
                where: {
                    shortUrlIndex: shortUrlIndex
                }
            });
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }

    static async deleteLink(shortUrlIndex: string) {
        try {
            await prisma.noUsersTable.deleteMany({
                where: {
                    shortUrlIndex: shortUrlIndex
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    static async addUserStatisticToLink(shortUrlIndex: string, userStatisticToAdd: any) {
        try {
            const link = await prisma.noUsersTable.findFirst({
                where: {
                    shortUrlIndex: shortUrlIndex
                },
                select: {
                    id: true,
                    userStatistic: true
                }
            });

            if (!link) {
                console.error(`Ссылка с индексом "${shortUrlIndex}" не найдена в БД.`);
                return;
            }

            const currentStatistics = Array.isArray(link.userStatistic) ? link.userStatistic : [];
            const updatedStatistic = [...currentStatistics, userStatisticToAdd];

            await prisma.noUsersTable.update({
                where: {
                    id: link.id
                },
                data: {
                    userStatistic: updatedStatistic
                }
            });

        } catch (error) {
            console.error(`Ошибка при добавлении статистики для ссылки "${shortUrlIndex}":`, error);
        }
    }

    static async resetUserStatisticInLink(shortUrlIndex: string) {
        try {
            const link = await prisma.noUsersTable.findFirst({
                where: {
                    shortUrlIndex: shortUrlIndex
                },
                select: {
                    id: true,
                    userStatistic: true
                }
            });

            if (!link) {
                console.error(`Ссылка с индексом "${shortUrlIndex}" не найдена в БД.`);
                return;
            }

            link.userStatistic = [];

            await prisma.noUsersTable.update({
                where: {
                    id: link.id
                },
                data: {
                    userStatistic: link.userStatistic
                }
            });
        } catch (error) {
            console.error(`Ошибка при сбросе статистики для ссылки "${shortUrlIndex}":`, error);
        }
    }

    static async existShortUrlIndex(shortUrlIndex: string) {
        try {
            const link = await prisma.noUsersTable.findFirst({
                where: {
                    shortUrlIndex: shortUrlIndex
                }
            });

            return !!link;
        } catch (error) {
            console.log("Ошибка сети: ", error);
        }
    }
}