const ItemList = require("../class/itemList.js");
const Loot = require("../class/loot.js");

const artifactEnum = require("../enums/artifact.js");
const lootEnum = require("../enums/loot.js");



/** @type {lootEnum} */
let lootItems = {};



/**
 * from Autominer
 */
lootItems.CommonBox = new Loot({
    key: "CommonBox",
    mineRange: {min: 30, max: 60},
    artifacts: [
        artifactEnum.Amber,
        {nr: artifactEnum.CakePiece, mul: 1}
    ],
    keyWords: ["CommonBox", "commonbox", "Common_Box", "common_box", "cb", "CB", "c", "C", "1", "100"]
});
lootItems.UncommonBox = new Loot({
    key: "UncommonBox",
    mineRange: {min: 40, max: 80},
    gemRange: {min: 1, max: 3},
    artifacts: [
        artifactEnum.Onyx,
        {nr: artifactEnum.CakePiece, mul: 2}
    ],
    keyWords: ["UncommonBox", "uncommonbox", "Uncommon_Box", "uncommon_box", "ub", "UB", "u", "U", "2", "101"]
});
lootItems.RareBox = new Loot({
    key: "RareBox",
    mineRange: {min: 80, max: 160},
    gemRange: {min: 5, max: 12},
    skills: [0, 1, 2],
    artifacts: [
        artifactEnum.Pearl,
        {nr: artifactEnum.CakePiece, mul: 3}
    ],
    keyWords: ["RareBox", "rarebox", "Rare_Box", "rare_box", "rb", "RB", "r", "R", "3", "102"]
});
lootItems.EpicBox = new Loot({
    key: "EpicBox",
    mineRange: {min: 160, max: 320},
    gemRange: {min: 20, max: 45},
    skills: [0, 1, 2, {e: 3, c: 2}, {e: 4, c: 2}, {e: 5, c: 2}],
    artifacts: [
        artifactEnum.FeohRune,
        {nr: artifactEnum.CakePiece, mul: 5}
    ],
    keyWords: ["EpicBox", "epicbox", "Epic_Box", "epic_box", "eb", "EB", "e", "E", "4", "103"]
});
lootItems.LegendaryBox = new Loot({
    key: "LegendaryBox",
    mineRange: {min: 280, max: 560},
    gemRange: {min: 120, max: 300},
    skills: [3, 4, 5],
    artifacts: [
        artifactEnum.CheeseCube,
        {nr: artifactEnum.CakePiece, mul: 7}
    ],
    keyWords: ["LegendaryBox", "legendarybox", "Legandary_Box", "legandary_box", "lb", "LB", "l", "L", "5", "104"]
});
lootItems.UltimateBox = new Loot({
    key: "UltimateBox",
    mineRange: {min: 2000, max: 4000},
    gemRange: {min: 1000, max: 2000},
    skills: [3, 4, 5, {e: 6, c: 2}],
    artifacts: [
        artifactEnum.BlueMushroom,
        {nr: artifactEnum.CakePiece, mul: 9}
    ],
    keyWords: ["UltimateBox", "ultimatebox", "Ultimate_Box", "ultimate_box", "ub", "UB", "6", "105"]
});



/**
 * Special
 */
lootItems.UltimateBox = new Loot({
    key: "UltimateBox",
    dynamicLoot: true,
    mineRange: {min: 3, max: 10},
    gemRange: {min: 5, max: 8},
    artifacts: [
        artifactEnum.OldCalendar,
        artifactEnum.TinTicket,
        artifactEnum.GreenCoin
    ],
    keyWords: ["UltimateBox", "ultimatebox", "Ultimate_Box", "ultimate_box", "ub", "UB", "6", "105"]
});

lootItems = new ItemList(lootItems);

module.exports = lootItems;