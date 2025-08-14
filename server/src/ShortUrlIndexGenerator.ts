export default class ShortUrlIndexGenerator {
    static getRandomShortIndex(): string {
        //Возможных комбинаций - 36^6 = 2_176_782_336
        try {
            let index: string = "";
            const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (let i: number = 0; i < 5; i++) {
                index += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
            }
            return index;
        } catch (error) {
            console.log("Ошибка получения рандомного индекса: ", error);
            return ""
        }
    }
}