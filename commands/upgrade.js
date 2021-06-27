const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const colorSet = require("../data/colorSet.js");
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

function upgradeommand({playerData, params}) {
    const type = params[0];

    let fields = [], color, item;
    if (typeof type === "undefined") {
        for (let i = 0, l = upgradeItems.length; i < l; i++) {
            item  = upgradeItems[i];

            if (!item.unlocked(playerData)) {
                fields.push({
                    name : `:lock: Reach ${item.unlockMessage} to unlock more upgrade`,
                    value: "** **"
                });
                break;
            }

            fields.push(util.upgradeListField(item, playerData, true));
        }
    } else if (upgradeItemsKeyWords.includes(type)) {
        item = upgradeItems[upgradeItemsDict.get(type)];
        
        const result = item.buy(playerData);
        color = result.color;
        fields.push(result.field);

        playerData = result.playerData;
    } else {
        return {
            message: "`That upgrade doesn't exists!`"
        }
    }

    return {
        playerData,
        message: {
            command: "Upgrade" + util.subCommandsToTitle(util.keyNameToWord(item.key)),
            color: color ?? colorSet.Gold,
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