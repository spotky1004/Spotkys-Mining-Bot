const Discord = require("discord.js");
const D = require("decimal.js");
const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const imageList = require("../data/imageList.js");

function serverStatsCommand({msg, params, guildData, isDM}) {
    if (isDM) return {
        message: "Unable to use this command on DM!"
    }
    return {
        message: {
            style: "list",

            command: "Server Stats",
            image: imageList.trophy,
            description: "Stats about this server (today/total)",
            color: "#e6126e",
            fields: [
                {
                    name: "Commands Executed",
                    value: `${guildData.commandCounterToday.length}/${guildData.commandCounter}`
                },
                {
                    name: "Users",
                    value: `${Object.keys(guildData.usersToday).length}/${guildData.users.length}`
                }
            ],
        }
    }
}

module.exports = new Command({
    keyWords: ["serverStats", "serverstats", "serverstat", "serverStat", "server", "ss"],
    regex: null,
    func: serverStatsCommand,
    permissionReq: Permission.User
});