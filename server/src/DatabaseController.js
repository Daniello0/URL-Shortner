const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();
const DataMiner = require('./userStatisticModules/DataMiner.js');

class DatabaseController {
    static async createLink({url, shortUrlIndex}) {
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

    static async readLink(shortUrlIndex) {
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

    static async deleteLink(shortUrlIndex) {
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

    static async addUserStatisticToLink(shortUrlIndex, userStatisticToAdd) {
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

    static async resetUserStatisticInLink(shortUrlIndex) {
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

}

module.exports = DatabaseController;