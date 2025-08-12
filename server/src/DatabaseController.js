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
            console.error(error);
        }
    }

    static async deleteLink({url, shortUrlIndex}) {
        try {
            await prisma.noUsersTable.deleteMany({
                where: {
                    url: url,
                    shortUrlIndex: shortUrlIndex
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    static async addUserStatisticToLink(shortUrlIndex) {
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

            const newStatisticEntry = await DataMiner.getUserStatisticData();

            const currentStatistics = Array.isArray(link.userStatistic) ? link.userStatistic : [];
            const updatedStatistic = [...currentStatistics, newStatisticEntry];

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

}

module.exports = DatabaseController;