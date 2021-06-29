const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const oreEnum = require("../enums/ore.js");

const emojiList = require("../data/emojiList.js");
const imageList = require("../data/imageList.js");

const oreEmoji = emojiList.ores;
const oreSet = util.enumToSets(oreEnum);

const randomTips = [
    "Inventory.",
    "This is your Inventory",
    "Opened your inventory",
    "inventory / inv / i",
    "=i",
    "Welcome to your inventory",
    "Can I have some of them? :O"
];

function inventoryCommand({playerData, params}) {
    const [type, idx] = params;

    const fields = [];

    switch (type) {
        case "o":
            const miningRegion = idx;
            fields.push(
                {
                    name: "Your Ores:",
                    value: util.oreSetToMessage({
                        oreEmoji: oreEmoji[miningRegion],
                        reginOreSet: oreSet[miningRegion],
                        displayMode: playerData.options.displayMode
                    })
                }
            );
            break;
    }

    return {
        playerData: playerData,
        message: {
            command: `Inventory`,
            color: colorSet.Leaf,
            image: imageList.cubeStone,
            fields: [...fields],
            footer: util.randomPick(randomTips)
        }
    }
}

module.exports = new Command({
    keyWords: ["inventory", "inv", "i", "I", "INV"],
    regex: /^(o|ore) ([0-9])/,
    func: inventoryCommand,
    permissionReq: Permission.User
});