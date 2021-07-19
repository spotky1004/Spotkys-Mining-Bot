const util = require("../util.js");

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
    keyWords: [util.generateKeyWord("CommonBox", true), "1", "100"].flat()
});
lootItems.UncommonBox = new Loot({
    key: "UncommonBox",
    mineRange: {min: 40, max: 80},
    gemRange: {min: 1, max: 3},
    artifacts: [
        artifactEnum.Onyx,
        {nr: artifactEnum.CakePiece, mul: 2}
    ],
    keyWords: [util.generateKeyWord("UncommonBox", true), "2", "101"].flat()
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
    keyWords: [util.generateKeyWord("RareBox", true), "3", "102"].flat()
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
    keyWords: [util.generateKeyWord("EpicBox", true), "4", "103"].flat()
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
    keyWords: [util.generateKeyWord("LegendaryBox", true), "5", "104"].flat()
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
    keyWords: [util.generateKeyWord("UltimateBox", true), "6", "105"].flat()
});



/**
 * Special
 */
lootItems.DailyBag = new Loot({
    key: "DailyBag",
    dynamicLoot: true,
    mineRange: {min: 3, max: 10},
    gemRange: {min: 5, max: 8},
    artifacts: [
        artifactEnum.OldCalendar,
        artifactEnum.TinTicket,
        artifactEnum.GreenCoin
    ],
    keyWords: [util.generateKeyWord("DailyBag", true), "7", "200"].flat()
});

lootItems = new ItemList(lootItems);

module.exports = lootItems;