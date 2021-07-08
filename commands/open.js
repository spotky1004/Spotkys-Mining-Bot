const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

function commandFunction({playerData, params}) {
    const [lootKeyWord, count] = params;

    let subCmds = [];

    return {
        playerData: playerData,
        message: {
            command: "Open" + util.subCommandsToTitle(subCmds),
            fields: [{
                name: "** **",
                value: "Params: " + params.join(", "),
            }],
        },
    }
}

module.exports = new Command({
    keyWords: ["open", "o", "O", "loot", "l", "L", "use", "USE"],
    paramRegex: [/^[^0-9]+/, /^[0-9]+/],
    func: commandFunction,
    permission: Permission.Admin
});