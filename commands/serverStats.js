const Discord = require("discord.js");
const D = require("decimal.js");
const Command = require("../command.js");
const Permission = require("../enums/permission.js");

function serverStatsCommand({msg, params, guildData}) {
    return {
        message: {
            style: "list",

            command: "Server Stats",
            image: "https://i.imgur.com/LMJtv0D.png",
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
    keyWords: ["serverStats", "server", "serverstats"],
    regex: null,
    func: serverStatsCommand,
    permissionReq: Permission.User
});