const fs = require ('fs');

class Archivo {

    constructor(file) {
        this.file = file;
        this.encoding = "utf8"
    }

    async writeFile (data) {

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(data, null, '\t'));
        } catch (error) {
            console.log(error);
        }
    }

    async readFile (data) {

        try {
            const stock = await fs.promises.readFile(data, this.encoding);
            const stockJS = JSON.parse(stock)
            return stockJS
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { Archivo }