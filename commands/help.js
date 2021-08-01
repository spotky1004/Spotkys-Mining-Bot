const Command = require("../class/command.js");
const SubCommandHelp = require("../class/subCommandHelp.js");
const Permission = require("../enums/permission.js");

const colorSet = require("../data/colorSet.js");

const subCommandHelp = new SubCommandHelp([
    {
        title: "Help Command",
        data: [
            {
                cmd: "help/h",
                msg: "Show this message (TODO: Command Unlock System)"
            },
        ],
    },
    {
        title: "Basic Command",
        data: [
            {
                cmd: "mine/m",
                msg: "Mine some ores"
            },
            {
                cmd: "inv/i",
                msg: "Display Your Inventory"
            },
            {
                cmd: "sell",
                msg: "Sell your ores"
            },
            {
                cmd: "upgrade/u",
                msg: "Display/Buy upgrade"
            }
        ]
    },
    {
        title: "Function Command",
        data: [
            {
                cmd: "daily/d",
                msg: "Get a daily reward"
            },
            {
                cmd: "artifact/a",
                msg: "Show artifact things"
            },
            {
                cmd: "collect/c",
                msg: "Collect autominer (TODO: Loot Threshold)"
            },
            {
                cmd: "loot/l",
                msg: "Loot related things"
            },
            {
                cmd: "gem/g",
                msg: "Open gem shop (TODO)"
            },
            {
                cmd: "skill/s",
                msg: "View/Use skills (TODO)"
            },
            {
                cmd: "exchance/d",
                msg: "Exchange things (TODO)"
            },
            {
                cmd: "infuse/i",
                msg: "Infuse gem for boost (TODO)"
            }
        ]
    },
    {
        title: "Misc Command",
        data: [
            {
                cmd: "stat/st",
                msg: "Display stats (TODO: Form stats)"
            },
            {
                cmd: "serverStat/ss",
                msg: "Display server stats (TODO: From old bot)"
            },
            {
                cmd: "leaderboard/l",
                msg: "Display leaderboard (TODO)"
            },
            {
                cmd: "invite",
                msg: "Invite me! (TODO)"
            },
            {
                cmd: "bonus/b",
                msg: "Bonus! See bot status! (TODO)"
            },
            {
                cmd: "bump",
                msg: "bump count? (TODO)"
            }
        ]
    }
]);

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function helpCommand({guildData, playerData}) {
    const fields = subCommandHelp.makeField(playerData, guildData);

    return {
        message: {
            command: "Help",
            color: colorSet.Leaf,
            fields: fields,
            footer: "Help!",
        }
    }
}

module.exports = new Command({
    keyWords: ["help", "HELP", "h", "H"],
    func: helpCommand,
    permissionReq: Permission.User
});