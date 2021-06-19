const D = require("decimal.js");
const Command = require("../command.js");
const Permission = require("../Enums/permission.js");

const oreEnum = require("../enums/ore.js");

const emojiList = require("../data/emojiList.js");
const util = require("../util.js");

const oreEmoji = emojiList.ore;
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
];

function mineCommand({playerData, time}) {
    const reginOreSet = oreSet[playerData.miningRegion];


    if (time - playerData.behaveTimes.mine < 3000) return {
        message: `\`Cooldown! ${(3 - (time - playerData.behaveTimes.mine)/1000).toFixed(3)} second(s) left\``
    }
    playerData.behaveTimes.mine = time;

    let minedOre = Array.from({length: reginOreSet.length}, (_, i) => i === 0 ? new D(playerData.ores.Stone.mul(Math.random()*1000)) : new D(0));
    /* TODO: ore mine formula */



    for (let i = 0, l = minedOre.length; i < l; i++) {
        playerData.ores[reginOreSet[i]] = playerData.ores[reginOreSet[i]].add(minedOre[i]);
    }



    return {
        playerData: playerData,
        message: {
            command: "Mine",
            color: "#e0931f",
            image: "https://i.imgur.com/xAZJT1w.png",
            fields: [
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
                }
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