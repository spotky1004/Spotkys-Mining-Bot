const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const util = require("../util.js");

const colorSet = require("../data/colorSet.js");

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function dailyCommand({playerData, time}) {
    return {
        message: {
            command: "Daily",
            color: colorSet.Pink,
            fields: [],
            footer: "Daily reward!",
        }
    }
}

module.exports = new Command({
    keyWords: ["daily", "d", "D", "ㅇ"],
    func: dailyCommand,
    permissionReq: Permission.User
});