const D = require("decimal.js");
const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");

const oreEnum = require("../enums/ore.js");

const imageList = require("../data/imageList.js");
const emojiList = require("../data/emojiList.js");
const util = require("../util.js");

const oreEmoji = emojiList.ores;
const oreSet = util.enumToSets(oreEnum);

const randomDescriptions = [
    "you feel your wallet getting thicker",
    "you feel your inventory getting lighter",
    "where will you use this money?",
    "Coin +1",
    "goodbye to your ores"
];

function sellCommand({playerData}) {
    const coinMult = util.calcStat("coinMult", playerData);

    let coinGot = new D(0);
    for (const name in oreEnum) {
        coinGot = coinGot.add(
            new D(3).pow(oreEnum[name]-100).mul(coinMult).mul(playerData.ores[name])
        );
        playerData.ores[name] = new D(0);
    }

    playerData.coin = playerData.coin.add(coinGot);

    return {
        playerData: playerData,
        message: {
            command: "Sell",
            color: "#e8cf2a",
            image: imageList.coin,
            fields: [
                {
                    name: "You got:",
                    value: util.itemMessage({
                        have   : playerData.coin,
                        got    : coinGot,
                        emoji  : emojiList.coin,
                        isBlank: coinGot.eq(0)
                    })
                },
            ],
            description: util.randomPick(randomDescriptions)
        }
    }
}

module.exports = new Command({
    keyWords: ["sell", "SELL", "s"],
    regex: null,
    func: sellCommand,
    permissionReq: Permission.User
});