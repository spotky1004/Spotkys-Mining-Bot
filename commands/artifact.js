const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const artifactEnum = require("../enums/artifact.js");
const artifactSet  = util.enumToSets(artifactEnum);

const emojis = require("../data/emojiList.js");
const imageList = require("../data/imageList.js");

const artifactCoinItems = require("../data/artifactCoinItems.js");

const randomTips = [
    "artifact coin is too expensive!",
    "they aren't easy to get",
    "they have mystical power",
];

function artifactCommand({playerData, params, guildData}) {
    const [tab, _, subTab] = params;

    let fields = [], subCmds = [];
    switch (tab) {
        case "inventory": case "i":
            subCmds.push("Inventory")
            subCmds.push(subTab)
            break;
        case "coin": case "c":
            const result = artifactCoinItems.searchBuy(subTab, playerData);
            fields = result.fields;

            subCmds.push("Coin");
            subCmds.push(result.itemName);
            
            playerData = result.playerData;
            break;
        case "buy": case "b":
            subCmds.push("Buy");
            break;
        case "refund": case "r":
            subCmds.push("Refund");
            break;
        case undefined:
            fields = util.makeHelpFields({
                title: "Artifact Commands",
                data: [
                    {cmd: "artifact inventory {page:[1-3]}", msg: "Show your Artifacts", inline: false},
                    {cmd: "artifact coin {coin|gem}", msg: "Open Ancient Coin shop"},
                    {cmd: "artifact buy {index:[1-3]}", msg: "Buy Artifact with Ancient Coin"},
                    {cmd: "artifact refund", msg: "Refund Ancient Coin", inline: false}
                ],
                guildData
            });
    }
    
    return {
        playerData: playerData,
        message: {
            command: `Artifact` + util.subCommandsToTitle(subCmds),
            color: colorSet.Ivory,
            image: imageList.artifact,
            fields: [{
                name: `You have \`${util.notation(util.calcStat.AncientCoinCurrent(playerData), 0)}\`/\`${util.notation(util.calcStat.AncientCoinTotal(playerData), 0)}\` ${emojis.ancientCoin}`,
                value: "** **"
            }, ...fields],
            footer: util.randomPick(randomTips)
        }
    }
}

module.exports = new Command({
    keyWords: ["artifact", "ARTIFACT", "arti", "art", "a", "A", "ㅁ"],
    regex: /^(inventory|coin|buy|refund|i|c|b|r)?((?: )([1-3]|ore|gem|o|g))?/,
    canAcceptEmpty: true,
    func: artifactCommand,
    permissionReq: Permission.Admin
});