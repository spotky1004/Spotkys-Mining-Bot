const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const playerData = require("../saveDatas/Defaults/playerData.js")

const emojiList = require("../data/emojiList.js");
const imageList = require("../data/imageList.js");

const oreEnum = require("../enums/ore.js");
const oreSet = util.enumToSets(oreEnum);

const skillEnum = require("../enums/skill.js");
const skillSet = util.enumToSets(skillEnum);

const randomTips = [
    "Inventory.",
    "This is your Inventory",
    "Opened your inventory",
    "inventory / inv / i",
    "=i",
    "Welcome to your inventory",
    "Can I have some of them? :O"
];

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function inventoryCommand({playerData, params}) {
    const [type, idx] = params;

    const fields = [];

    switch (type) {
        case "o": case "ore":
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
        case "s": case "skill":
            let field = {
                name: "Your Skills:",
                value: ""
            };
            skillSet.some(e => {
                if (playerData.skills[e]) return;
                field.value += ""
            });
            break;
    }

    return {
        playerData: playerData,
        message: {
            command: `Inventory`,
            color: colorSet.Leaf,
            image: imageList.cubeStone,
            fields: [...fields],
            footer: util.randomPick(randomTips),
        }
    }
}

module.exports = new Command({
    keyWords: ["inventory", "inv", "i", "I", "INV"],
    paramRegex: [/^o|ore|s|skill/, /^[0-9]/],
    func: inventoryCommand,
    permissionReq: Permission.User
});