const util = require("../util.js");

class ItemList {
    constructor(items) {
        this.items = items;
        if (typeof items === "array") {
            this.length = this.items.length;
            for (let i = 0; i < this.length; i++) {
                this[i] = this.items[i];
            }
        } else {
            const arrItems = Object.entries(this.items);

            this.length = arrItems.length;
            for (let i = 0; i < this.length; i++) {
                this[i] = arrItems[i][1];
            }
        }
        
        const tmp = util.dataToKeywordDictionary(items);
        this.itemDictionary = tmp.Dictionary;
        this.keyWords = tmp.KeyWords;
    }
    length = new Number;
    upgrades = new Array;
    itemDictionary = new Map;
    keyWords = new Array;

    search(keyword) {
        if (typeof keyword === "undefined") {
            return null;
        } else if (this.keyWords.includes(keyword)) {
            return this.items[this.itemDictionary.get(keyword)];
        } else {
            return undefined;
        }
    }
}

module.exports = ItemList;