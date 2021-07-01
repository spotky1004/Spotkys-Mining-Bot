const Decimal = require("decimal.js");

const Ores = require("../../enums/ore.js");
const Loots = require("../../enums/loot.js");
const Skills = require("../../enums/skill.js");
const Artifacts = require("../../enums/artifact.js");

const DisplayModes = require("../../enums/displayMode.js");

const playerData = {
    // resources
    coin: new Decimal(0),
    gem: new Decimal(0),
    ores: Object.fromEntries(Object.keys(Ores).map(e => [e, new Decimal(0)])),
    loots: Object.fromEntries(Object.keys(Loots).map(e => [e, new Decimal(0)])),
    skills: Object.fromEntries(Object.keys(Skills).map(e => [e, new Decimal(0)])),
    artifact: Object.fromEntries(Object.keys(Artifacts).map(e => [e, 0])),
    totalAncientCoin: 0,
    gemOrb: new Decimal(0),
    
    
    // upgrades
    upgrade: {
        pickaxe: 1,
        autominerSpeed: 0,
        autominerCap: 0,
        amulet: 0,
        ring: 0,
        rope: 0
    },
    gemUpgrades: {
        
    },
    ancientCoin: {
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
    nextArtifactSelection: [0, 1, 2],
    backupSaved: 0,
    backupPointer: 0,

    // author
    id: null,
    name: null
}

module.exports = playerData;