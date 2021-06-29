const util = require("../util.js");
const colorSet = require("../data/colorSet.js");

const UpgradeList = class {
    constructor(upgrades) {
        this.upgrades = [...upgrades];
        this.length = this.upgrades.length;
        for (let i = 0; i < this.length; i++) {
            this[i] = this.upgrades[i];
        }
        
        const tmp = util.dataToKeywordDictionary([...upgrades]);
        this.itemDictionary = tmp.Dictionary;
        this.keyWords = tmp.KeyWords;
    }
    upgrades = new Array();
    itemDictionary = new Map();
    keyWords = new Array();

    searchBuy(keyword, playerData) {
        let fields = [], color, item, itemName;

        if (typeof keyword === "undefined") {
            for (let i = 0; i < this.length; i++) {
                const item = this.upgrades[i];

                if (item.unlocked(playerData)) {
                    fields.push(util.upgradeListField(item, playerData, true));
                } else {
                    fields.push({
                        name: `:lock: Reach ${item.unockMessage} to unlock next upgrade!`,
                        value: "** **"
                    });
                    break;
                }
            }
        } else if (this.keyWords.includes(keyword)) {
            item = this.upgrades[this.itemDictionary.get(keyword)];
            itemName = item.key;

            const result = item.buy(playerData);
            color = result.color;
            fields.push(result.field);

            playerData = result.playerData;
        } else {
            color = colorSet.Red;
            fields.push({
                message: "`That item doesn't exists!`",
                value: "** **"
            });
        }

        return {playerData, fields, color, itemName};
    }
}

module.exports = UpgradeList;