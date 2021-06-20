const Decimal = require("decimal.js");

const Ores = require("../../enums/ore.js");
const Loots = require("../../enums/loot.js");
const Skills = require("../../enums/skill.js");

const DisplayModes = require("../../enums/displayMode.js");

const playerData = {
    // resources
    coin: new Decimal(0),
    gem: new Decimal(0),
    ores: Object.fromEntries(Object.keys(Ores).map(e => [e, new Decimal(0)])),
    loots: Object.fromEntries(Object.keys(Loots).map(e => [e, new Decimal(0)])),
    skills: Object.fromEntries(Object.keys(Skills).map(e => [e, new Decimal(0)])),
    artifact: new Array(30),
    totalAncientCoin: 0,
    gemOrb: new Decimal(0),
    
    
    // upgrades
    upgrades: {
        pickaxe: 0,
        autominerSpeed: 0,
        autominerTime: 0,
        amulet: 0,
        ring: 0,
        rope: 0
    },
    gemUpgrades: {
        
    },
    artifactShop: {
        ore: 0,
        gem: 0
    },
    
    
    // configs
    miningRegion: 0,
    oreLock: Object.fromEntries(Object.keys(Ores).map(e => [e, false])),
    infuse: {},
    options: {
        displayMode: "Desktop",
        notation: "Standard"
    },
    
    
    // stats
    mineCount: new Decimal(0),
    lootOpened: new Decimal(0),
    userName: null,
    dailyCollected: 0,
    bestLootLuck: -1,
    bestLootGot: -1,
    totalArtifact: 0,
    ancientCoinHave: 0,
    closestMine: 3000,
    

    // merged
    behaveTimes: {
        mine: 0,
        autominer: 1e100,
        skill: Object.fromEntries(Object.keys(Skills).map(e => [e, 0])),
        daily: 0,
        refundArtifact: 0,
        bonus: 0
    },


    // etc
    nextArtifactSelection: [10, 11, 12],
    backupSaved: 0,
    backupPointer: 0
}

module.exports = playerData;