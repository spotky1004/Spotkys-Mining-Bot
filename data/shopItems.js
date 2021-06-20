const D = require("decimal.js");

const emojiList = require("../data/emojiList.js");
const util = require("../util.js");

const pickaxeEnum = require("../enums/pickaxe.js");
const pickaxeSet = util.enumToSets(pickaxeEnum);



const shopItems = [
    {
        mainKeyWord: "pic",
        namespace: function(level) {
            const tier = util.calcPickaxeTier(level);

            let sub;
            if (tier === 0) sub = 0;
            else sub = util.pickaxeLevels[tier-1];
            
            return util.toShopNameSpace({
                emoji    : emojiList.pickaxe[pickaxeSet[tier]],
                shortName: this.mainKeyWord,
                level    : level - sub,
                levelMax : util.pickaxeLevels[tier] - sub,
                name     : `(tot lv.${level}) ${util.getPickaxeName(level)}`
            });
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
        keyWords: ["pic", "pick", "pickaxe", "p", "P"],
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
    }
];

module.exports = shopItems;