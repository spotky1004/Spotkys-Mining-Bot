const Artifact = require("../class/artifact.js");
const artifactEnum = require("../enums/artifact.js");



/** @type {artifactEnum} */
let artifactItems = {};

/**
 *  from Artifact Shop
 */
artifactItems.MiningLantern = new Artifact({
    key: "MiningLantern",
    maxLevel: 10,
    effects: (lv) => 0.02*lv,
    effectsFormer: "Reduce Ore Distribution by -$ (-0.02 per)",
    unlockMessage: "Artifact Shop",
});
artifactItems.IronRings = new Artifact({
    key: "IronRings",
    maxLevel: 6,
    effects: (lv) => [3*lv, 20*lv],
    effectsFormer: "For each mine, Skip Autominer by $1sec (+3 sec per artifact) & add Autominer Cap by $2min (+20 min per artifact)",
    unlockMessage: "Artifact Shop"
});
artifactItems.LightPlant = new Artifact({
    key: "LightPlant",
    maxLevel: 10,
    effects: (lv) => 1+0.15*lv,
    effectsFormer: "Multiply Daily Reward by x$ (+0.15x per artifact)",
    unlockMessage: "Artifact Shop"
});
artifactItems.CheesePiece = new Artifact({
    key: "CheesePiece",
    maxLevel: 10,
    effects: (lv) => 1+0.3*lv,
    effectsFormer: "Multiply Pickaxe Roll by x$ (+0.3x per artifact)",
    unlockMessage: "Artifact Shop"
});
artifactItems.SkillBook = new Artifact({
    key: "SkillBook",
    maxLevel: 8,
    effects: (lv) => 1+0.25*lv,
    effectsFormer: "Multiply All Skill Effects by x$ (+0.25x per artifact)",
    unlockMessage: "Artifact Shop"
});
artifactItems.PolyOrb = new Artifact({
    key: "PolyOrb",
    maxLevel: 20,
    effects: (lv) => 1+0.4*lv,
    effectsFormer: "Multiply Coin Gain by x$ (+0.4x per artifact)",
    unlockMessage: "Artifact Shop"
});
artifactItems.Slime = new Artifact({
    key: "Slime",
    maxLevel: 5,
    effects: (lv) => 1+0.1*lv,
    effectsFormer: "Multiply Autominer Loot Progress by x$ (+0.1x per artifact)",
    unlockMessage: "Artifact Shop"
});
artifactItems.HpPotion = new Artifact({
    key: "HpPotion",
    maxLevel: 8,
    effects: (lv) => 0.3*lv,
    effectsFormer: "Reduce Mining Cooldown by -$sec (-0.3sec per artifact before multiply)",
    unlockMessage: "Artifact Shop"
});
artifactItems.SparklingPotion = new Artifact({
    key: "SparklingPotion",
    maxLevel: 12,
    effects: (lv) => 1+0.25*lv,
    effectsFormer: "Multiply Crystalize Gem Gain by x$ (+0.25x per artifact)",
    unlockMessage: "Artifact Shop"
});
artifactItems.ExpandPotion = new Artifact({
    key: "ExpandPotion",
    maxLevel: 5,
    effects: (lv) => [1+6*lv, 1+4*lv],
    effectsFormer: "Makes Mining x$1 (+6x per artifact) powerful, but Multiply Mining Cooldown by x$2 (+4x per artifact)",
    unlockMessage: "Artifact Shop"
});

/**
 *  from Loot
 */
artifactItems.OldCalendar = new Artifact({
    key: "OldCalendar",
    maxLevel: 50,
    effects: (lv) => 1.1**lv,
    effectsFormer: "Multiply Pickaxe Roll by x$ (x1.1 per artifact)",
    unlockMessage: "Daily Bag"
});
artifactItems.TinTicket = new Artifact({
    key: "TinTicket",
    maxLevel: 50,
    effects: (lv) => 1.1**lv,
    effectsFormer: "Divide Picaxe Price by ÷$ (x1.1 per artifact)",
    unlockMessage: "Daily Bag"
});
artifactItems.GreenCoin = new Artifact({
    key: "GreenCoin",
    maxLevel: 50,
    effects: (lv) => 1.1**lv,
    effectsFormer: "Multiply Coin Gain by x$ (x1.1 per artifact)",
    unlockMessage: "Daily Bag"
})
artifactItems.Amber = new Artifact({
    key: "Amber",
    getChance: (lv) => 0.90*(0.98**lv),
    maxLevel: 99,
    effects: (lv) => 1+0.1*lv,
    effectsFormer: "Multiply Pickaxe Roll by x$ (+0.1x per artifact)",
    unlockMessage: "Autominer Loot"
});
artifactItems.Onyx = new Artifact({
    key: "Onyx",
    getChance: (lv) => 0.81*(0.9**lv),
    maxLevel: 15,
    effects: (lv) => 1+0.08*lv,
    effectsFormer: "Autominer works at x$ speed (+0.08x per artifact)",
    unlockMessage: "Autominer Loot"
});
artifactItems.Pearl = new Artifact({
    key: "Pearl",
    getChance: (lv) => 0.72*(0.97**lv),
    maxLevel: 50,
    effects: (lv) => 1+0.2*lv,
    effectsFormer: "Multiply Coin Gain by x$ (+0.2x per artifact)",
    unlockMessage: "Autominer Loot"
});
artifactItems.FeohRune = new Artifact({
    key: "FeohRune",
    getChance: (lv) => 0.63*(0.9**lv),
    maxLevel: 25,
    effects: (lv) => 4*lv,
    effectsFormer: "Chance to get double loot: $% (+5% per artifact)",
    unlockMessage: "Autominer Loot"
});
artifactItems.CheeseCube = new Artifact({
    key: "CheeseCube",
    getChance: (lv) => 0.54*(0.97**lv),
    maxLevel: 50,
    effects: (lv) => 1+0.25*lv,
    effectsFormer: "Discount Pickaxe Price by ÷$ (+0.25÷ per artifact)",
    unlockMessage: "Autominer Loot"
});
artifactItems.BlueMushroom = new Artifact({
    key: "BlueMushroom",
    getChance: (lv) => 0.05*(0.9**lv),
    maxLevel: 50,
    effects: (lv) => 1,
    effectsFormer: "TBA",
    unlockMessage: "Autominer Loot"
});
artifactItems.CakePiece = new Artifact({
    key: "CakePiece",
    getChance: (lv) => 0.01*(0.85**lv),
    maxLevel: 32,
    effects: (lv) => 1+0.2*lv,
    effectsFormer: "Multiply chance to get artifact by x$ (+0.2x per artifact)",
    unlockMessage: "Autominer Loot (Very rare!)"
});


module.exports = artifactItems;