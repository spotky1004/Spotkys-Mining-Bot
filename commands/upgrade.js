const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const upgradeItems = require("../data/upgradeItems.js");

const imageList = require("../data/imageList.js");
const emojiList = require("../data/emojiList.js");

const oreEnum = require("../enums/ore.js");
const oreEmoji = emojiList.ore;
const oreSet = util.enumToSets(oreEnum);

const randomTips = [
    "Upgrade yourself!",
    "Upgrade your tools!",
    "Upgrade your machines!",
    "you feel your pickaxe is getting stronger",
    "Can I have your golds?",
    "Can I have your items?",
    "Please buy them :D",
    "Please buy it :D",
    "Upgrade them to unlock more upgrades",
    "upgrade to unlock more upgrade!",
    "upgrade / upg / u / ㅕ"
];

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns}
 */
function upgradeommand({playerData, params}) {
    const type = params[0];

    const result = upgradeItems.searchBuy(type, playerData);

    return {
        playerData: result.playerData,
        message: {
            command: "Upgrade" + util.subCommandsToTitle(util.keyNameToWord((result.itemName ?? ""))),
            color: result.color ?? colorSet.Gold,
            image: imageList.coin,
            fields: [...result.fields],
            footer: util.randomPick(randomTips)
        }
    }
}

module.exports = new Command({
    keyWords: ["upgrade", "upg", "u", "U", "ㅕ"],
    paramRegex: [/^[A-z]+/],
    func: upgradeommand,
    permissionReq: Permission.User
});