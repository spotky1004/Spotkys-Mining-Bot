const D = require("decimal.js");

const Command = require("../class/command.js");
const Cooldown = require("../class/cooldown.js");
const Permission = require("../enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const oreEnum = require("../enums/ore.js");

const imageList = require("../data/imageList.js");
const emojiList = require("../data/emojiList.js");

const oreEmoji = emojiList.ores;
const oreSet = util.enumToSets(oreEnum);

const randomTips = [
    "Pick!",
    "pick",
    "pick, Pick, PICK!",
    "Mine!",
    "mine",
    "You got these ores",
    "mine / m / ㅡ",
    "much ore",
    "many ore",
    "that's a lot of ore",
    "these ores are sent to your inventory",
    "there are total of 21 ores now",
    "=m"
];

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function mineCommand({playerData, time}) {
    let fields = [];
    let reginOreSet = oreSet[playerData.miningRegion], minedOre;

    const mineCooldown = new Cooldown(util.calcStat.MiningCooldown(playerData));
    if (!mineCooldown.isDone(playerData.behaveTimes.mine)) {
        fields.push({
            name: "Cooldown!",
            value: mineCooldown.format(playerData.behaveTimes.mine)
        });
    } else {
        playerData.behaveTimes.mine = time;

        const rollStat = util.calcStat.Roll(playerData);
        minedOre = util.rollMine({
            reginOreSet: reginOreSet,
            luck: util.calcStat.Luck(playerData),
            roll: rollStat.max.sub(rollStat.min).mul(Math.random()).add(rollStat.min),
            playerData
        });
        for (let i = 0, l = minedOre.length; i < l; i++) {
            playerData.ores[reginOreSet[i]] = playerData.ores[reginOreSet[i]].add(minedOre[i]);
        }

        playerData.mineCount = playerData.mineCount.add(util.calcStat.MineMult(playerData));
        playerData.behaveTimes.autominer -= util.calcStat.AutominerSkip(playerData);

        fields.push(util.setToMessage({
            playerData,
            parentKey: "ores",
            resourceSet: reginOreSet,
            fieldName: "Your ores:",
            lineBreakPer: 7,
            direction: "down",
            got: minedOre
        }));
    }

    return {
        playerData,
        message: {
            command: "Mine",
            color: colorSet.Brown,
            image: imageList.pickaxe[util.getPickaxeName(playerData.upgrade.pickaxe).replace(/\s+/g, '')],
            fields: fields,
            footer: util.randomPick(randomTips)
        },
        components: [
            [
                {type: "BUTTON", custom_id: "mineCommand", label: "Mine again!", style: "SUCCESS"},
            ]
        ],
        /*editAfter: [
            {
                type: "addition",
                time: util.calcStat.MiningCooldown(playerData),
                content: {
                    buttons: new disbut.MessageButton()
                        .setID("mine")
                        .setStyle("green")
                        .setLabel("Mine Again!")
                }
            }
        ]*/
    }
}

module.exports = new Command({
    keyWords: ["mine", "m", "M", "MINE", "ㅡ", "pick", "PICK"],
    func: mineCommand,
    permissionReq: Permission.User
});