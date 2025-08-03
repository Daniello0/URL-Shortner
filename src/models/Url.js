export default class Url {

    #url = ""

    constructor(url) {
        this.#url = url;
    }

    set url(url) {
        this.#url = url;
    }

    get url() {
        return this.#url;
    }

    async getShortUrl(urlShortner) {
        return await urlShortner.getShortUrl(this.#url);
    }

    getStatUrl() {
        return this.#url += "+";
    }

    isValid() {
        return true;
    }
}