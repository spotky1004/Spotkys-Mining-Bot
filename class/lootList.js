const ItemList = require("./itemList.js");

const util = require("../util");
const colorSet = require("../data/colorSet.js");

class LootList extends ItemList {
    constructor(loots) {
        super(loots);
    }

    searchDisplay(keyword, playerData) {
        const item = this.search(keyword);

        if (item === null || typeof item == "undefined") {

        } else {
            
        }
    }

    searchOpen(keyword, playerData) {

    }
}