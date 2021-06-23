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
    "Pick!",
    "pick",
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

function mineCommand({playerData, time}) {
    const cooldown = util.calcStat("mineCool", playerData);
    if (time - playerData.behaveTimes.mine < cooldown) return {
        message: `\`Cooldown! ${(cooldown/1000 - (time - playerData.behaveTimes.mine)/1000).toFixed(3)} second(s) left\``
    }
    playerData.behaveTimes.mine = time;
    


    const reginOreSet = oreSet[playerData.miningRegion];

    const rollStat = util.calcStat("roll", playerData);

    const minedOre = util.rollMine({
        reginOreSet: reginOreSet,
        luck: util.calcStat("luck", playerData),
        roll: rollStat.max.sub(rollStat.min).mul(Math.random()).add(rollStat.min)
    });

    for (let i = 0, l = minedOre.length; i < l; i++) {
        playerData.ores[reginOreSet[i]] = playerData.ores[reginOreSet[i]].add(minedOre[i]);
    }



    return {
        playerData: playerData,
        message: {
            command: "Mine",
            color: "#e0931f",
            image: imageList.pickaxe[util.getPickaxeName(playerData.upgrade.pickaxe)],
            fields: [
                // Boosts display
                // {},
                // Mined ore display
                {
                    name: "You got:",
                    value: util.oreSetToMessage({
                        playerData: playerData,
                        ores: minedOre,
                        oreEmoji: oreEmoji,
                        reginOreSet: reginOreSet,
                        displayMode: playerData.options.displayMode
                    })
                },
                // Rare resources display
                // {},
            ],
            description: util.randomPick(randomDescriptions)
        }
    }
}

module.exports = new Command({
    keyWords: ["mine", "m", "M", "MINE", "ㅡ"],
    regex: null,
    func: mineCommand,
    permissionReq: Permission.User
});