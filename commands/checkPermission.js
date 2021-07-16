const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function serverStatsCommand({msg, params, guildData, permission}) {
    return {
        message: `Your Permission Level: ${permission}`
    }
}

module.exports = new Command({
    keyWords: ["permission", "checkPermission", "checkpermission", "cp"],
    func: serverStatsCommand,
    permissionReq: Permission.Ban
});