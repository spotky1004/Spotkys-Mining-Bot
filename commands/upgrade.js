const D = require("decimal.js");
const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");

const util = require("../util.js");

const upgradeItems = require("../data/upgradeItems.js");
const upgradeItemsDict     = util.dataToKeywordDictionary(upgradeItems).Dictionary;
const upgradeItemsKeyWords = util.dataToKeywordDictionary(upgradeItems).KeyWords;

const imageList = require("../data/imageList.js");
const emojiList = require("../data/emojiList.js");

const oreEnum = require("../enums/ore.js");
const oreEmoji = emojiList.ore;
const oreSet = util.enumToSets(oreEnum);

const randomDescriptions = [
    "Upgrade yourself!",
    "pick, Pick, PICK!",
    "Can I have your golds?",
    "Please buy them :D",
    "Upgrade them to unlock more upgrades"
];

function upgradeommand({playerData, params}) {
    const type = params[0];

    let fields = [], color;
    if (typeof type === "undefined") {
        for (let i = 0, l = upgradeItems.length; i < l; i++) {
            const item  = upgradeItems[i];
            const level = playerData.upgrade[item.key];

            fields.push({
                name : item.namespace(level),
                value: util.upgradeListMessage(item, level, playerData, true)
            });
        }
    } else if (upgradeItemsKeyWords.includes(type)) {
        const item = upgradeItems[upgradeItemsDict.get(type)];
        const result = item.buy(playerData);
        if (result) {
            color = "#1dad1f";
            playerData = result;
        } else {
            color = "#ad1d1d";
        }

        const level = playerData.upgrade[item.key];
        fields.push({
            name : item.namespace(level),
            value: util.upgradeListMessage(item, level, playerData, false)
        });
    } else {
        return {
            message: "`That upgrade doesn't exists!`"
        }
    }

    return {
        playerData,
        message: {
            command: "Upgrade" + (type ? " 》 " + type : ""),
            color: color ?? "#e8cf2a",
            image: imageList.coin,
            fields: [...fields],
            description: util.randomPick(randomDescriptions)
        }
    }
}

module.exports = new Command({
    keyWords: ["upgrade", "upg", "u", "U", "ㅕ"],
    regex: /^([A-z]+)?/,
    canAcceptEmpty: true,
    func: upgradeommand,
    permissionReq: Permission.User
});