const D = require("decimal.js");

const Command = require("../class/command.js");
const SubCommandHelp = require("../class/subCommandHelp.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const emojiList = require("../data/emojiList.js");
const imageList = require("../data/imageList.js");

const oreEnum = require("../enums/ore.js");
const oreSet = util.enumToSets(oreEnum);

const lootEnum = require("../enums/loot.js");
const lootSet = util.enumToSets(lootEnum).flat();

const skillEnum = require("../enums/skill.js");
const skillSet = util.enumToSets(skillEnum);

const randomTips = [
    "💰",
    "Inv",
    "Inventory",
    "Inventory.",
    "This is your Inventory",
    "Welcome to your inventory",
    "Your inventory",
    ":D",
    "Opened your inventory",
    "inventory / inv / i",
    "=i",
    "Can I have some of them? :O",
];

const subCommandHelp = new SubCommandHelp([
    {
        title: "Inventory Commands",
        data: [
            {
                cmd: "inventory ore/o",
                msg: "Show your Ores",
                inline: false
            },
            {
                cmd: "inventory loot/l",
                msg: "Show your Loots",
                inline: false,
                unlocked: (playerData) => playerData.upgrade.pickaxe >= 11,
                unlockMessage: "Stone Pickaxe"
            },
            {
                cmd: "inventory skill/s",
                msg: "Show your Skills",
                inline: false,
                unlocked: (playerData) => playerData.upgrade.pickaxe >= 11,
                unlockMessage: "Stone Pickaxe"
            }
        ],
    }
]);

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function inventoryCommand({playerData, guildData, params}) {
    const [type, idx] = params;

    let subCmds = [], fields = [];

    switch (type) {
        default:
            fields = subCommandHelp.makeField(playerData, guildData);
            break;
        case "o": case "ore":
            subCmds.push("Ore");

            const miningRegion = idx ?? playerData.miningRegion;
            fields.push(util.setToMessage({
                playerData,
                parentKey: "ores",
                resourceSet: oreSet[miningRegion],
                fieldName: "Your ores:",
                lineBreakPer: 7,
                direction: "down"
            }));
            break;
        case "l": case "loot":
            subCmds.push("Loot");
            fields.push(util.setToMessage({
                playerData,
                parentKey: "loots",
                resourceSet: lootSet,
                fieldName: "Your loots:",
                lineBreakPer: 3
            }));
            break;
        case "s": case "skill":
            subCmds.push("Skill");
            fields.push(util.setToMessage({
                playerData,
                parentKey: "skills",
                resourceSet: skillSet,
                fieldName: "Your Skills:",
                lineBreakPer: 3
            }));
            break;
    }

    return {
        playerData: playerData,
        message: {
            command: "Inventory" + util.subCommandsToTitle(subCmds),
            color: colorSet.Leaf,
            image: imageList.cubeStone,
            fields: [...fields],
            footer: util.randomPick(randomTips),
        }
    }
}

module.exports = new Command({
    keyWords: ["inventory", "inv", "i", "I", "INV"],
    paramRegex: [/^o|ore|l|loot|s|skill/, /^[0-9]/],
    func: inventoryCommand,
    permissionReq: Permission.User
});