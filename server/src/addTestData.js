const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    console.log('Начинаем заполнение тестовыми данными...');

    const link = await prisma.noUsersTable.create({
        data: {
            url: "https://www.youtube.com",
            shortUrlIndex: "YT123",
            userStatistic: []
        }
    })

    console.log('Тестовые данные успешно добавлены!');
    console.log({ link });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // Обязательно отключаемся от БД
        await prisma.$disconnect();
    });