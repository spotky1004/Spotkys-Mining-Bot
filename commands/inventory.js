const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const emojiList = require("../data/emojiList.js");
const imageList = require("../data/imageList.js");

const oreEnum = require("../enums/ore.js");
const oreSet = util.enumToSets(oreEnum);

const lootEnum = require("../enums/loot.js");

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

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function inventoryCommand({playerData, params}) {
    const [type, idx] = params;

    let subCmds = [], fields = [];

    switch (type) {
        case "o": case "ore":
            subCmds.push("Ore");

            const miningRegion = idx ?? playerData.miningRegion;
            fields.push(
                {
                    name: "Your Ores:",
                    value: util.oreSetToMessage({
                        reginOreSet: oreSet[miningRegion],
                        displayMode: playerData.options.displayMode,
                        playerData
                    })
                }
            );
            break;
        case "l": case "loot":
            subCmds.push("Loot");

            
            break;
        case "s": case "skill":
            subCmds.push("Skill");

            let field = {
                name: "Your Skills:",
                value: ""
            };
            skillSet.some(e => {
                if (playerData.skills[e] < 1) return;
                field.value += util.itemMessage({
                    emoji: emojiList.skills[e],
                    have: playerData.skills[e]
                });
                field.value += "\n";
            });
            fields.push(field);
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