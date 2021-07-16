const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const emojiList = require("../data/emojiList.js");
const imageList = require("../data/imageList.js");
const util = require("../util.js");

const Loot = require("../class/loot.js");
const lootItem = require("../data/lootItems.js");

const oreEnum = require("../enums/ore.js");
const oreSet = util.enumToSets(oreEnum);

const skillEnum = require("../enums/skill.js");
const skillSet = util.enumToSets(skillEnum);

const artifactItems = require("../data/artifactItems.js");
const artifactEnum = require("../enums/artifact.js");
const artifactSet = util.enumToSets(artifactEnum);

const randomTips = [
    "Loot"
];

function commandFunction({playerData, params}) {
    const [lootKeyWord, countStr] = params;

    let subCmds = [], fields = [], color;
    /** @type {Loot} */
    const loot = lootItem.search(lootKeyWord);
    switch (loot) {
        case null:
            color = colorSet.Red;
            fields.push({
                name: "Loot Help Message Placeholder",
                value: "** **"
            });
            break;
        case undefined:
            color = colorSet.Red;
            fields.push({
                name: "That Loot doens't exists!",
                value: "** **"
            });
            break;
        default:
            subCmds.push(util.keyNameToWord(loot.key));

            let count = 0;
            if (["open", "use", "o", "u"].includes(countStr)) count = 1;
            else count = +countStr;



            if (0 < count && count <= 10_000) {
                subCmds.push(`Open(${util.notation(count).replace(/ /g, "")})`);

                if (playerData.loots[loot.key] < count) {
                    color = colorSet.Red;
                    fields.push({
                        name: "`You don't have that much loot!`",
                        value: "** **"
                    });
                } else {
                    const result = loot.open(count, playerData);
                    playerData.loots[loot.key] -= count;
                
                    // Mine
                    const reginOreSet = oreSet[playerData.miningRegion];
                    for (let i = 0, l = result.oreGot.length; i < l; i++) {
                    playerData.ores[reginOreSet[i]] = playerData.ores[reginOreSet[i]].add(result.oreGot[i]);
                    }
                    if (result.oreGot.some(e => e.gt(0))) fields.push({
                    name: emojiList.pickaxe.StonePickaxe + " Mine Roll (" + util.notation(result.oreRollCount).replace(/ /g, "") + ")",
                    value: util.oreSetToMessage({
                        playerData,
                        ores: result.oreGot,
                        reginOreSet: oreSet[playerData.miningRegion],
                        displayMode: playerData.options.displayMode
                    })
                    });
                
                    // Gem
                    playerData.gem = playerData.gem.add(result.gemGot);
                    if (loot.gemRange.max) fields.push({
                    name: "Gem " + util.itemMessage({
                        emoji: emojiList.gem,
                        got: result.gemGot,
                        have: playerData.gem,
                        isBlank: result.gemGot === 0,
                        blankFiller: "no gem"
                    }),
                    value: "** **"
                    });
                
                    // Skill
                    let skillField = {
                    name: emojiList.skill + " Skill",
                    value: ""
                    }
                    for (const id in result.skillGot) {
                    const key = skillSet[id];
                    playerData.skills[key] += result.skillGot[id];

                    skillField.value += util.itemMessage({
                        emoji: emojiList.skills[key],
                        got: result.skillGot[id],
                        have: playerData.skills[key]
                    });
                    skillField.value += " " + util.keyNameToWord(key);
                    skillField.value += "\n";
                    }
                    skillField.value.trim();
                    if (Object.keys(result.skillGot).length > 0) fields.push(skillField);
                
                    // Artifact
                    let artifactField = {
                    name: emojiList.ancientCoin + " Artifact",
                    value: ""
                    }
                    let i = 0;
                    for (const id in result.artifactGot) {
                    const key = artifactSet[id];
                    playerData.artifact[key] += result.artifactGot[id];
                    
                    artifactField.value += util.itemMessage({
                        emoji: emojiList.artifact[key],
                        got: result.artifactGot[id],
                        have: playerData.artifact[key],
                        isBlank: playerData.artifact[key] === 0,
                        blankFiller: "locked"
                    });
                    artifactField.value += artifactItems[key].chanceString(playerData, loot.artifacts[i].mul ?? 1);
                    artifactField.value += " " + util.keyNameToWord(key);
                    artifactField.value += "\n";

                    i++;
                    }
                    artifactField.value.trim();
                    if (Object.keys(result.skillGot).length > 0) fields.push(artifactField);
                    else fields.push({
                    name: emojiList.ancientCoin + " Artifact",
                    value: util.itemMessage({
                        isBlank: true,
                        blankFiller: "no artifact"
                    })
                    })
                }
            } else {
                fields.push(...loot.lootTable(playerData));
            }
            break;
    }

    return {
        playerData,
        message: {
            command: "Open" + util.subCommandsToTitle(subCmds),
            fields: fields,
            color: color ?? colorSet.Purple,
            image: imageList.loots[(loot ?? {}).key ?? "CommonBox"],
            footer: util.randomPick(randomTips)
        },
    }
}

module.exports = new Command({
    keyWords: ["loot", "l", "L", "ㅣ"],
    paramRegex: [/^([^0-9]+|[0-9]+)/, /^(open|use|o|u|[0-9]+)/],
    func: commandFunction,
    permissionReq: Permission.Admin
});