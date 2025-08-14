class ShortUrlIndexGenerator {
    static getRandomShortIndex() {
        //Возможных комбинаций - 36^6 = 2_176_782_336
        try {
            let index = "";
            const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (let i = 0; i < 5; i++) {
                index += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
            }
            return index;
        } catch (error) {
            console.log("Ошибка получения рандомного индекса: ", error);
        }
    }
}

module.exports = ShortUrlIndexGenerator;