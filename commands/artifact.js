const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const artifactEnum = require("../enums/artifact.js");
const artifactSet  = util.enumToSets(artifactEnum);

const emojiList = require("../data/emojiList.js");
const imageList = require("../data/imageList.js");

const artifactItems = require("../data/artifactItems.js");
const artifactCoinItems = require("../data/artifactCoinItems.js");

const randomTips = [
    "artifact coin is too expensive!",
    "they aren't easy to get",
    "they have mystical power",
];

function artifactCommand({playerData, params, guildData}) {
    let [tab, _, subTab] = params;

    let fields = [], subCmds = [];
    switch (tab) {
        case "inventory": case "i":
            subCmds.push("Inventory");
            subCmds.push(subTab);

            subTab = Number(subTab)-1;

            fields.push({
                name: `You have \`${util.calcStat.ArtifactHave(playerData)}\` Artifacts`,
                value: "** **"
            });
            for (let i = subTab*10; i < (subTab+1)*10; i++) {
                const artifact = artifactItems[artifactSet[i]];
                fields.push(artifact.listField(playerData));
            }
            break;
        case "coin": case "c":
            const result = artifactCoinItems.searchBuy(subTab, playerData);
            fields = result.fields;

            subCmds.push("Coin");
            subCmds.push(result.itemName);
            
            playerData = result.playerData;
            break;
        case "buy": case "b":
            if (util.calcStat.AncientCoinCurrent(playerData) <= 0) return {message: "`Have at last 1 Acient Coin to open this menu`"};

            subCmds.push("Buy");
            const selection = playerData.nextArtifactSelection;
            if (!["1", "2", "3"].includes(subTab)) {
                for (let i = 0; i < 3; i++) {
                    if (selection[i] === -1) continue;
                    const message = artifactItems[artifactSet[selection[i]]].listField(playerData);
                    fields.push({
                        name: `\`${i+1}.\` ` + message.name.replace(/`/g, ""),
                        value: message.value
                    });
                }
            } else {
                const i = subTab-1;
                if (selection[i] === -1) return {message: "`That Index is Empty!`"};

                const artifactName = artifactSet[selection[i]];
                playerData.artifact[artifactName]++;
                fields.push(artifactItems[artifactName].listField(playerData));

                playerData.nextArtifactSelection.fill(-1);
                for (let i = 0; i < 3; i++) {
                    const available = Array.from({length: 10*((i+1)/3)-Math.floor(10*(i/3))}, (_, j) => j+Math.floor(10*(i/3))).filter(e => playerData.artifact[artifactSet[e]] < artifactItems[artifactSet[e]].maxLevel);
                    playerData.nextArtifactSelection[i] = util.randomPick(available);
                }
            }
            break;
        case "refund": case "r":
            subCmds.push("Refund");
            
            for (let i = 0; i < 10; i++) playerData.artifact[artifactSet[i]] = 0;
            fields.push({
                name: "Refund done!",
                value: "** **"
            });
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
                name: `You have \`${util.notation(util.calcStat.AncientCoinCurrent(playerData), 0)}\`/\`${util.notation(util.calcStat.AncientCoinTotal(playerData), 0)}\` ${emojiList.ancientCoin}`,
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