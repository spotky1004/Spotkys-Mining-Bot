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
    "chuff chuff",
    "it's diligent",
    "\*gear rotation sound*"
];

function mineCommand({playerData, time}) {
    playerData.behaveTimes.autominer = Math.min(playerData.behaveTimes.autominer, time);

    const timeSpent = Math.min(time-playerData.behaveTimes.autominer, util.calcStat("autominerCap", playerData)*3600*1000);
    const rollCount = Math.floor(timeSpent/util.calcStat("autominerSpeed", playerData));
    
    const rollStat = util.calcStat("roll", playerData);

    const reginOreSet = oreSet[playerData.miningRegion];
    const efficiency = Math.random()*0.1 + 0.9;
    const minedOre = util.rollMine({
        reginOreSet: reginOreSet,
        luck: util.calcStat("luck", playerData),
        roll: rollStat.max.mul(efficiency).add(rollStat.min.mul(1-efficiency)).div(2).mul(rollCount)
    });

    for (let i = 0, l = minedOre.length; i < l; i++) {
        playerData.ores[reginOreSet[i]] = playerData.ores[reginOreSet[i]].add(minedOre[i]);
    }

    if (rollCount >= 1) playerData.behaveTimes.autominer = time;


    return {
        playerData: playerData,
        message: {
            command: "Collect",
            color: "#7d7d7d",
            image: imageList.auto,
            fields: [
                {
                    name: `Mined \`${util.notation(rollCount)}\` times (${(timeSpent/1000).toFixed(3)}sec spent)`,
                    value: util.oreSetToMessage({
                        playerData: playerData,
                        ores: minedOre,
                        oreEmoji: oreEmoji,
                        reginOreSet: reginOreSet,
                        displayMode: playerData.options.displayMode
                    })
                }
            ],
            description: util.randomPick(randomDescriptions)
        }
    }
}

module.exports = new Command({
    keyWords: ["collect", "COLLECT", "c", "C", "ㅊ", "col", "COL"],
    regex: /^(now)?/,
    canAcceptEmpty: true,
    func: mineCommand,
    permissionReq: Permission.User
});