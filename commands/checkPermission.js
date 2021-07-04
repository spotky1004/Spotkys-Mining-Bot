const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");

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