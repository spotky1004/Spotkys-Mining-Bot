const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const oreEnum = require("../enums/ore.js");

const imageList = require("../data/imageList.js");
const emojiList = require("../data/emojiList.js");

const oreEmoji = emojiList.ores;
const oreSet = util.enumToSets(oreEnum);

const randomTips = [
    "you feel your wallet getting thicker",
    "you feel your inventory getting lighter",
    "where will you use this money?",
    "Coin +1",
    "goodbye to your ores"
];

function sellCommand({playerData}) {
    const coinMult = util.calcStat.CoinMult(playerData);

    let coinGot = new D(0);
    for (const name in oreEnum) {
        coinGot = coinGot.add(
            new D(3).pow(oreEnum[name]-100).mul(coinMult).mul(playerData.ores[name])
        );
        playerData.ores[name] = new D(0);
    }

    coinGot = coinGot.floor(0);
    playerData.coin = playerData.coin.add(coinGot);

    return {
        playerData: playerData,
        message: {
            command: "Sell",
            color: colorSet.Gold,
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
            footer: util.randomPick(randomTips)
        }
    }
}

module.exports = new Command({
    keyWords: ["sell", "SELL", "s", "ㄴ"],
    regex: null,
    func: sellCommand,
    permissionReq: Permission.User
});