const D = require("decimal.js");

const Upgrade = require("../class/upgrade.js");
const UpgradeList = require("../class/upgradeList.js");

const emojiList = require("./emojiList.js");
const util = require("../util.js");

const pickaxeEnum = require("../enums/pickaxe.js");
const pickaxeSet = util.enumToSets(pickaxeEnum);

const oreSet = util.enumToSets(require("../enums/ore.js")).flat();
const lootSet = util.enumToSets(require("../enums/loot.js")).flat();

const upgradeItemsEnum = require("../enums/upgradeItems.js");
/** @type {upgradeItemsEnum} */
let upgradeItems = {};

upgradeItems.pickaxe = new Upgrade({
    parentKey: "upgrade",
    key: "pickaxe",
    shortName: "pic",
    maxLevel: 250,
    namespace: function(level) {
        const tier = util.calcPickaxeTier(level);

        let sub;
        if (tier === 0) sub = 0;
        else sub = util.pickaxeLevels[tier-1];
        
        return util.toShopNameSpace({
            emoji    : emojiList.pickaxe[pickaxeSet[tier]],
            shortName: this.shortName,
            level    : level - sub,
            maxLevel : util.pickaxeLevels[tier] - sub,
            name     : `(tot lv.${level}) ${util.getPickaxeName(level)}`
        });
    },
    effectsFormer: {
        RollMin: "$",
        RollMax: "$",
        Luck   : "$"
    },
    effects: function(level) {
        const tier = util.calcPickaxeTier(level);

        let RollMin, RollMax, Luck;
        Luck = Math.min(21, 1+level/10);
        level = new D(level);
        
        switch (tier) {
            case 0:
                RollMin = new D(1).add(level.div(4));
                RollMax = new D(2).add(level.pow(1.1));
                break;
            case 1:
                RollMin = new D(1).add(level.div(3.5));
                RollMax = new D(2).add(level.pow(1.15));
                break;
            case 2:
                RollMin = new D(1).add(level.div(3));
                RollMax = new D(2).add(level.pow(1.2));
                break;
            case 3:
                RollMin = new D(1).add(level.div(2.4));
                RollMax = new D(2).add(level.pow(1.25));
                break;
            case 4:
                RollMin = new D(1).add(level.div(1.8));
                RollMax = new D(2).add(level.pow(1.3));
                break;
            case 5:
                RollMin = new D(1).add(level.div(1.4));
                RollMax = new D(2).add(level.pow(1.4)).add(level.sub(149).mul(level.sub(148)).sqrt(2).mul(25));
                break;
            default:
                RollMin = new D(0);
                RollMax = new D(0);
        }

        RollMin = RollMin.floor(0);
        RollMax = RollMax.floor(0);
        return {
            RollMin,
            RollMax,
            Luck
        }
    },
    keyWords: [util.generateKeyWord("pickaxe", true), util.generateKeyWord("roll")].flat(),
    calcCost: function(level) {
        const tier = util.calcPickaxeTier(level);

        let cost;
        switch (tier) {
                case 0: cost = new D(  5).mul(new D(1).add(new D(level-1).pow(1.5))).floor(); break;
                case 1: cost = new D( 10).mul(new D(1).add(new D(level-1).pow(1.7))).floor(); break;
                case 2: cost = new D( 20).mul(new D(1).add(new D(level-1).pow(1.9))).floor(); break;
                case 3: cost = new D( 40).mul(new D(1).add(new D(level-1).pow(2.1+0.02*(level-60)))).floor(); break;
                case 4: cost = new D( 80).mul(new D(1).add(new D(level-1).pow(2.9+0.04*(level-100)))).floor(); break;
                case 5: cost = new D(160).mul(new D(1).add(new D(level-1).pow(3.5+(level-150)*(0.083+(level-150)*0.0015)+1))).floor(); break;
                default:cost = new D(Infinity);
        }
        
        return {
            resource: ["coin"],
            cost    : cost
        };
    },
    unlocked: function(playerData) {return true},
    unlockMessage: "what"
});
upgradeItems.autominerSpeed = new Upgrade({
    parentKey: "upgrade",
    key: "autominerSpeed",
    shortName: "asp",
    maxLevel: 24,
    emoji: emojiList.auto,
    effectsFormer: {
        Interval: "$sec",
    },
    effects: function(level) {
        return {
            Interval: level > 0 ? 60-level*2 : Infinity
        }
    },
    keyWords: [util.generateKeyWord("autominerSpeed", true), util.generateKeyWord("interval")].flat(),
    calcCost: function(level) {
        return {
            resource: ["ores", oreSet[Math.floor(level/2)]],
            cost    : new D(100).mul(new D(1.5).pow(level%2).mul(new D(level/2+1).floor(0).pow(0.4))).ceil(0)
        }
    },
    unlocked: function(playerData) {return playerData.upgrade.pickaxe > util.pickaxeLevels[0]},
    unlockMessage: "Next pickaxe tier"
});
upgradeItems.amulet = new Upgrade({
    parentKey: "upgrade",
    key: "amulet",
    shortName: "amu",
    maxLevel: 6,
    emoji: emojiList.amulet,
    effectsFormer: {
        CoinMultiply: "x$"
    },
    effects: function(level) {
        return {
            CoinMultiply: 2**level
        }
    },
    keyWords: [util.generateKeyWord("amulet", true), util.generateKeyWord("coinGain")].flat(),
    calcCost: function(level) {
        return {
            resource: ["loots", lootSet[level]],
            cost    : 3+level
        }
    },
    unlocked: function(playerData) {return playerData.upgrade.pickaxe > util.pickaxeLevels[1]},
    unlockMessage: "Next pickaxe tier"
});
upgradeItems.ring = new Upgrade({
    parentKey: "upgrade",
    key: "ring",
    shortName: "rin",
    maxLevel: 10,
    emoji: emojiList.ring,
    effectsFormer: {
        OreDistribution: "-$"
    },
    effects: function(level) {
        return {
            OreDistribution: 0.04*level
        }
    },
    keyWords: [util.generateKeyWord("ring", true), util.generateKeyWord("oreDistribution")].flat(),
    calcCost: function(level) {
        return {
            resource: ["ores", oreSet[12+Math.floor(level/2)]],
            cost    : Math.floor(50 * (level+1)**(1+level/12))
        }
    },
    unlocked: function(playerData) {return playerData.upgrade.pickaxe > util.pickaxeLevels[2]},
    unlockMessage: "Next pickaxe tier"
});
upgradeItems.rope = new Upgrade({
    parentKey: "upgrade",
    key: "rope",
    shortName: "rop",
    maxLevel: 99,
    emoji: emojiList.rope,
    effectsFormer: {
        AutominerSkip: "$ sec/mine"
    },
    effects: function(level) {
        return {
            AutominerSkip: level
        }
    },
    keyWords: [util.generateKeyWord("rope", true), util.generateKeyWord("AutominerSkip")].flat(),
    calcCost: function(level) {
        return {
            resource: ["coin"],
            cost    : new D(1e9).mul(new D(level+1).pow(4+level/8))
        }
    },
    unlocked: function(playerData) {return playerData.upgrade.pickaxe > util.pickaxeLevels[3]},
    unlockMessage: "Next pickaxe tier"
});

upgradeItems = new UpgradeList(upgradeItems);

module.exports = upgradeItems;