const D = require("decimal.js");

const Upgrade = require("../class/upgrade.js");
const UpgradeList = require("../class/upgradeList.js");

const emojiList = require("./emojiList.js");
const util = require("../util.js");

const pickaxeEnum = require("../enums/pickaxe.js");
const pickaxeSet = util.enumToSets(pickaxeEnum);

const oreSet = util.enumToSets(require("../enums/ore.js")).flat();

const artifactCoinItemsEnum = require("../enums/artifactCoinItems.js");
/** @type {artifactCoinItemsEnum} */
let artifactCoinItems = {};
artifactCoinItems.ore = new Upgrade({
    parentKey: "ancientCoin",
    key: "ore",
    shortName: "ore",
    unlockMessage: "none",
    maxLevel: 84,
    calcCost: function(level) {
        return {
            resource: ["ores", oreSet[level%24]],
            cost    : new D(1e3).pow(2+Math.floor(level/24))
        }
    },
    unlocked: function(playerData) {return true},
    effectsFormer: {},
    effects : function(playerData) {return {}},
    keyWords: ["ore", "o", "O"]
});
artifactCoinItems.gem = new Upgrade({
    parentKey: "ancientCoin",
    key: "gem",
    shortName: "gem",
    unlockMessage: "none",
    maxLevel: 99,
    calcCost: function(level) {
        return {
            resource: ["gem"],
            cost    : new D(1.7).pow(level).mul(100).floor(0)
        }
    },
    unlocked: function(playerData) {return true},
    effectsFormer: {},
    effects : function(playerData) {return {}},
    keyWords: ["gem", "g", "G"]
});



artifactCoinItems = new UpgradeList(artifactCoinItems);

module.exports = artifactCoinItems;