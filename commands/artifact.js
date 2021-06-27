const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const artifactEnum = require("../enums/artifact.js");
const artifactSet  = util.enumToSets(artifactEnum);

const imageList = require("../data/imageList.js");

const artifactCoinItems = require("../data/artifactCoinItems.js");

const randomDescriptions = [
    "exchange your artifact coin for an articaft!",
    "artifact coin is too expensive!",
    "they aren't easy to get",
    "they have mystical power",
];

function artifactCommand({playerData, params, guildData}) {
    const [tab, upgrade] = params;

    let fields = [], subCmds = [];
    switch (tab) {
        case "coin": case "c":
            subCmds.push("Coin");
            if (typeof upgrade === "undefined") {
                artifactCoinItems.some(e => {
                    fields.push(util.upgradeListField(e, playerData));
                    return false;
                })
            }
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
                    {cmd: "artifact {page:[1-9]}", msg: "Show your Artifacts", inline: false},
                    {cmd: "artifact coin {coin|gem}", msg: "Open Artifact Coin shop"},
                    {cmd: "artifact buy {index:[1-3]}", msg: "Buy Artifact with Artifact Coin"},
                    {cmd: "artifact refund", msg: "Refund Artifact Coin", inline: false}
                ],
                guildData
            });
    }
    
    return {
        playerData,
        message: {
            command: `Artifact` + util.subCommandsToTitle(subCmds),
            color: colorSet.Ivory,
            image: imageList.artifact,
            fields: [...fields]
        }
    }
}

module.exports = new Command({
    keyWords: ["artifact", "ARTIFACT", "arti", "art", "a", "A", "ㅁ"],
    regex: /^([1-9]|coin|buy|refund|c|b|r)?((?: )(?:[1-3]|ore|gem|o|g))?/,
    canAcceptEmpty: true,
    func: artifactCommand,
    permissionReq: Permission.User
});