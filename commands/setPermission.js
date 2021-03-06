const fs = require("fs");
const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const imageList = require("../data/imageList.js");

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function setPermissionCommand({msg, params, bot}) {
    const [id, level] = params;
    const foundUser = bot.users.cache.find(user => user.id == id);
    if (!foundUser) return {
        message: "Cannot found that user!"
    }

    if (Permission[level]) {
        const path = "./saveDatas/permissions.json";
        const permissionList = JSON.parse(fs.readFileSync(path));
        permissionList[id] = level;
        fs.writeFileSync(path, JSON.stringify(permissionList));
    } else {
        return {
            message: "`Invaild permission level!`"
        }
    }

    return {
        message: {
            color: colorSet.Metal,
            command: "Set Permission",
            image: imageList.auto,
            fields: [
                {
                    name: "Done!",
                    value: `Set \`${foundUser.username}'s\` permission level as ${level} (level: ${Permission[level]})`
                }
            ]
        }
    }
}

module.exports = new Command({
    keyWords: ["setPermission", "setpermission", "sp"],
    paramRegex: [/^\d+/, /^\w+/],
    func: setPermissionCommand,
    permissionReq: Permission.Admin
});