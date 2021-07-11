const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const imageList = require("../data/imageList.js");
const util = require("../util.js");

const lootItem = require("../data/lootItems.js");

function commandFunction({playerData, params}) {
    const [lootKeyWord, count] = params;

    let subCmds = [], fields = [], color;
    const loot = lootItem.search(lootKeyWord);
    if (loot === null) {
        fields.push({
            name: "Loot Help Message Placeholder",
            value: "** **"
        })
    } else if (loot === undefined) {
        color = colorSet.Red;
        fields.push({
            name: "That Loot doens't exists!",
            value: "** **"
        })
    } else {
        subCmds.push(util.keyNameToWord(loot.key));
        if (["open", "use", "o", "u"].includes(count)) count = 1;
        if (+count > 0) {
            subCmds.push(`Open(${count})`);
            if (playerData.loots[loot.key] < count) {
                color = colorSet.Red;
                field.push({
                    name: "** **",
                    value: "You don't have that much loot!"
                });
            } else {
                const result = loot.open(count, playerData);
                
            }
        } else {
            fields.push(...loot.lootTable(playerData));
        }
    }

    return {
        playerData: playerData,
        message: {
            command: "Open" + util.subCommandsToTitle(subCmds),
            fields: fields,
            color: colorSet.Purple,
            image: imageList.loots[(loot ?? {}).key ?? "CommonBox"],
        },
    }
}

module.exports = new Command({
    keyWords: ["loot", "l", "L", "ㅣ"],
    paramRegex: [/^([^0-9]+|[0-9]+)/, /^(open|use|o|u|[0-9]+)/],
    func: commandFunction,
    permission: Permission.Admin
});