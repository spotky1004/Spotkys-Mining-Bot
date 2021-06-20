const D = require("decimal.js");
const Command = require("../command.js");
const Permission = require("../Enums/permission.js");

const oreEnum = require("../enums/ore.js");

const emojiList = require("../data/emojiList.js");
const util = require("../util.js");

const oreEmoji = emojiList.ore;
const oreSet = util.enumToSets(oreEnum);

const randomDescriptions = [
    "Upgrade yourself!",
    "pick, Pick, PICK!",
    "I wanna have your golds",
    "Please buy them :D",
    "Upgrade them to unlock more upgrades",
    "That costs " + util.notation(new D(10).pow(Math.random()*40+20)) + " golds!"
];

function upgradeommand({playerData, params}) {
    const type = params[0];

    return {
        playerData: playerData,
        message: {
            command: "Upgrade" + (type ?? ""),
            color: "e8cf2a",
            image: "https://i.imgur.com/WOndRAd.png",
            fields: [...fields],
            description: util.randomPick(randomDescriptions)
        }
    }
}

module.exports = new Command({
    keyWords: ["upgrade", "upg", "u", "U", "ㅕ"],
    regex: /^([A-z]+)/,
    func: upgradeommand,
    permissionReq: Permission.User
});