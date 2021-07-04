const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

function lootCommand({playerData, params}) {
    const [lootKeyWord, count] = params;

    return {
        playerData: playerData,
        message: {
            command: "Loot" + util.subCommandsToTitle(subCmds),

        }
    }
}

module.exports = new Command({
    keyWords: ["open", "o", "O", "loot", "l", "L"],
    func: lootCommand,
    permission: Permission.Admin
});