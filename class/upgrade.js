const Decimal = require("decimal.js");
const D = Decimal;
const util = require("../util.js");

class Upgrade {
    constructor ({
        // string & number
        parentKey, key, shortName, unlockMessage, maxLevel,
        // data
        effectsFormer, keyWords,
        // function
        namespace, calcCost, effects, unlocked
    }) {
        this.parentKey = parentKey ?? "he";
        this.key = key ?? "hehe";
        this.shortName = shortName ?? "2hehe";
        this.unlockMessage = unlockMessage ?? "Buy something to unlock this";
        this.maxLevel = maxLevel;

        this.effectsFormer = effectsFormer;
        this.keyWords = keyWords;

        this.namespace = namespace;
        this.calcCost = calcCost;
        this.effects = effects;
        this.unlocked = unlocked;
    }
    parentKey = new String();
    key = new String();
    shortName = new String();
    unlockMessage = new String();
    maxLevel = new Number();
    effectsFormer = new Object();
    keyWords = new Array();
    namespace = new Function();
    effects = new Function();
    unlocked = new Function();

    buy(playerData) {
        if (playerData[this.parentKey][this.key] >= this.maxLevel) return false;

        const cost = this.calcCost(playerData[this.parentKey][this.key]);

        const parent = util.searchObject(playerData, cost.resource.splice(0, cost.resource.length-1));
        const resourceName = cost.resource[cost.resource.length-1];
        if (new D(parent[resourceName]).gte(cost.cost)) {
            if (typeof parent[resourceName] === "number" && typeof cost.cost === "number") {
                parent[resourceName] -= cost.cost;
                playerData[this.parentKey][this.key]++;
                return playerData;
            } else if (parent[resourceName] instanceof Decimal && cost.cost instanceof Decimal) {
                parent[resourceName] = parent[resourceName].sub(cost.cost);
                playerData[this.parentKey][this.key]++;
                return playerData;
            }
        }
    }
}

module.exports = Upgrade;