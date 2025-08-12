const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

class DatabaseController {
    static async create({url, shortUrlIndex}) {
        await prisma.noUsersTable.create({
            data: {
                url: url,
                shortUrlIndex: shortUrlIndex,
                userStatistic: []
            }
        })
    }
}

module.exports = DatabaseController;