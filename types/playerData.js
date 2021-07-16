const Decimal = require("decimal.js");

const oreEnum = require("../enums/ore.js");
const lootEnum = require("../enums/loot.js");
const skillEnum = require("../enums/skill.js");
const artifactEnum = require("../enums/artifact.js");
const infuseEnum = {};

const upgradeItmes = require("../enums/upgradeItems.js");
const gemUpgradeItems = {};


const playerData = {
    // resources
    coin: Decimal.Decimal,
    gem: Decimal.Decimal,
    ores: oreEnum,
    loots: lootEnum,
    skills: skillEnum,
    artifact: artifactEnum,
    totalAncientCoin: new Number,
    gemOrb: Decimal.Decimal,

    // upgrades
    upgrade: upgradeItmes,
    gemUpgrades: gemUpgradeItems,
    ancientCoint: {
        ore: new Number,
        gem: new Number
    },

    // configs
    miningRegion: new Number,
    oreLock: oreEnum,
    infuse: infuseEnum,
    options: {
        displayMode: new String,
        notation: new String,
    },

    // stats
    mineCount: Decimal.Decimal,
    lootOpened: Decimal.Decimal,
    userName: new String,
    dailyCollected: new Number,
    bestLootLuck: new Number,
    bestLootGot: new Number,
    totalArtifact: new Number,
    ancientCoinHave: new Number,
    closestMine: new Number,

    // merged
    behaveTimes: {
        mine: new Number,
        autominer: new Number,
        skill: skillEnum,
        daily: new Number,
        refundArtifact: new Number,
        bonus: new Number
    },

    // etc
    nextArtifactSelection: new Array(3),
    backupSaved: new Number,
    backupPointer: new Number,

    // author
    id: new String,
    name: new String,
};

module.exports = playerData;