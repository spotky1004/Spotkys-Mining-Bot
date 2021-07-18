const Decimal = require("decimal.js");
const D = Decimal;

const util = require("../util.js");
const colorSet = require("../data/colorSet.js");

class Upgrade {
    constructor ({
        // string & number
        parentKey, key, shortName, unlockMessage, emoji, maxLevel,
        // data
        effectsFormer, keyWords,
        // function
        namespace, calcCost, effects, unlocked
    }) {
        this.parentKey = parentKey ?? null;
        this.key = key ?? null;
        this.shortName = shortName ?? null;
        this.unlockMessage = unlockMessage ?? "something";
        this.emoji = emoji;
        this.maxLevel = maxLevel;

        this.effectsFormer = effectsFormer;
        this.keyWords = keyWords;

        this.namespace = namespace;
        this.calcCost = calcCost;
        this.effects = effects;
        this.unlocked = unlocked;
    }
    parentKey = new String;
    key = new String;
    shortName = new String;
    unlockMessage = new String;
    emoji = new String;
    maxLevel = new Number;
    effectsFormer = new Object;
    keyWords = new Array;
    namespace = new Function;
    effects = new Function;
    unlocked = new Function;

    buy(playerData) {
        if (!this.unlocked(playerData)) return {
            playerData,
            color: colorSet.Red,
            field: {
                name: `:lock: **${util.keyNameToWord(this.key)}**`,
                value: util.strs.sub + `\`req: ${this.unlockMessage}\``
            }
        };
        if (playerData[this.parentKey][this.key] >= this.maxLevel) return {
            playerData,
            color: colorSet.Red,
            field: {
                name: "`You reached max level!`",
                value: "** **"
            }
        };

        const cost = this.calcCost(playerData[this.parentKey][this.key]);

        const parent = util.searchObject(playerData, cost.resource.splice(0, cost.resource.length-1));
        const resourceName = cost.resource[cost.resource.length-1];

        let bought = false;
        if (new D(parent[resourceName]).gte(cost.cost)) {
            bought = true;
            if (typeof parent[resourceName] === "number" && typeof cost.cost === "number") {
                parent[resourceName] -= cost.cost;
                playerData[this.parentKey][this.key]++;
            } else if (parent[resourceName] instanceof Decimal && cost.cost instanceof Decimal) {
                parent[resourceName] = parent[resourceName].sub(cost.cost);
                playerData[this.parentKey][this.key]++;
            } else {
                return {
                    playerData,
                    color: colorSet.Red,
                    field: {
                        name: "Error!",
                        value: "** **"
                    }
                };
            }
        }
        return {
            playerData,
            color: bought ? colorSet.Green : colorSet.Red,
            field: util.upgradeListField(this, playerData, false)
        }
    }

    eff(playerData) {
        return this.effects(playerData[this.parentKey][this.key]);
    }
}

module.exports = Upgrade;