const Decimal = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const imageList = require("../data/imageList.js");

function statCommand({playerData}) {
    let fields = [];

    for (const stat in util.calcStat) {
        const value = util.calcStat[stat](playerData);
        
        fields.push({
            name : `**${util.keyNameToWord(stat)}**`,
            value: typeof value === "number" || value instanceof Decimal ?
                `\`${util.notation(value)}\`` :
                Object.entries(value).map(e => `${e[0]}: \`${util.notation(e[1])}\``).join("\n"),
            inline: true
        });
    }

    return {
        message: {
            command: "Stat",
            color: colorSet.Pink,
            image: imageList.trophy,
            fields: fields,
            footer: "stat"
        }
    };
}

module.exports = new Command({
    keyWords: ["stat", "STAT", "stats", "STATS", "st", "ST", "status", "STATUS", "stt", "STT"],
    func: statCommand,
    permissionReq: Permission.User
});