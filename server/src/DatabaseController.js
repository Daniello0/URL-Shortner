const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

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
}

module.exports = DatabaseController;