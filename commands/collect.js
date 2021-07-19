const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");

const lootEnum = require("../enums/loot.js");
const oreEnum = require("../enums/ore.js");

const colorSet = require("../data/colorSet.js");
const imageList = require("../data/imageList.js");
const emojiList = require("../data/emojiList.js");
const util = require("../util.js");

const oreSet = util.enumToSets(oreEnum);
const lootSet = util.enumToSets(lootEnum)[0];

const randomTips = [
    "chuff chuff",
    "it's diligent",
    "\*gear rotation sound*",
    "this machine uses your pickaxe",
    "collect / col / c / ㅊ"
];

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function collectCommand({playerData, time}) {
    let fields = [];

    playerData.behaveTimes.autominer = Math.min(playerData.behaveTimes.autominer, time);

    const timeSpent = Math.min(time-playerData.behaveTimes.autominer, util.calcStat.AutominerCap(playerData));
    const mineCount = Math.floor(timeSpent/util.calcStat.AutominerTickspeed(playerData));

    const pickaxeStat = util.calcStat.Roll(playerData);

    // mine
    const reginOreSet = oreSet[playerData.miningRegion];
    const efficiency = Math.random()*0.1 + 0.9;
    const minedOre = util.rollMine({
        reginOreSet: reginOreSet,
        luck: util.calcStat.Luck(playerData),
        roll: pickaxeStat.max.mul(efficiency).add(pickaxeStat.min.mul(1-efficiency)).div(2).mul(mineCount),
        playerData
    });
    for (let i = 0, l = minedOre.length; i < l; i++) playerData.ores[reginOreSet[i]] = playerData.ores[reginOreSet[i]].add(minedOre[i]);
    fields.push({
        name: `Mined \`${util.notation(mineCount)}\` times (\`${(timeSpent/1000/3600).toFixed(3)}h\`/\`${(util.calcStat.AutominerCap(playerData)/3600/1000).toFixed(3)}h\` spent)`,
        value: util.oreSetToMessage({
            playerData: playerData,
            ores: minedOre,
            reginOreSet: reginOreSet,
            displayMode: playerData.options.displayMode
        })
    });

    let lootMessage = "";
    // loot
    const lootProgress = mineCount * util.calcStat.LootProgressMult(playerData);
    const lootTier = util.calcLootTier(lootProgress);
    const lootCount = 1;
    const lootName = lootSet[lootTier];
    if (lootTier !== -1) playerData.loots[lootName] += lootCount;
    lootMessage += util.itemMessage({
        have: playerData.loots[lootName],
        got: lootCount,
        emoji: emojiList.loots[lootName],
        isBlank: lootTier === -1,
        blankFiller: "no loot"
    }) + `\n${util.strs.sub} Next tier at: \`${util.notation(lootProgress)}/${util.notation(util.lootProgressThreshold[lootTier+1])}\` | \`${util.notation(util.calcStat.LootProgressMult(playerData))}/mine\``;

    // additional items
    fields.push({
        name: `Additionally you got...`,
        value: lootMessage
    });


    if (mineCount >= 1) playerData.behaveTimes.autominer = time;


    return {
        playerData: playerData,
        message: {
            command: "Collect",
            color: colorSet.Metal,
            image: imageList.auto,
            fields: fields,
            footer: util.randomPick(randomTips)
        }
    }
}

module.exports = new Command({
    keyWords: ["collect", "COLLECT", "col", "COL", "c", "C", "ㅊ"],
    paramRegex: [/^now/],
    canAcceptEmpty: true,
    func: collectCommand,
    permissionReq: Permission.User
});