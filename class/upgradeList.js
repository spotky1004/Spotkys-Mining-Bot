const ItemList = require("./itemList.js")

const util = require("../util.js");
const colorSet = require("../data/colorSet.js");

class UpgradeList extends ItemList {
    constructor(upgrades, order) {
        super(upgrades);
        this.order = order;
    }

    searchBuy(keyword, playerData) {
        const item = this.search(keyword);
        let fields = [], color, itemName;

        if (item === null) {
            for (let i = 0; i < this.length; i++) {
                const tmpItem = this[i];

                if (tmpItem.unlocked(playerData)) {
                    fields.push(util.upgradeListField(tmpItem, playerData, true));
                } else {
                    fields.push({
                        name: `:lock: Reach ${tmpItem.unlockMessage} to unlock next upgrade!`,
                        value: "** **"
                    });
                    break;
                }
            }
        } else if (item) {
            itemName = item.key;

            const result = item.buy(playerData);
            color = result.color;
            fields.push(result.field);

            playerData = result.playerData;
        } else {
            color = colorSet.Red;
            fields.push({
                name: "`That item doesn't exists!`",
                value: "** **"
            });
        }

        return {playerData, fields, color, itemName};
    }
}

module.exports = UpgradeList;