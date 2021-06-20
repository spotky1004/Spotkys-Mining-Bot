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
    "these ores are sent to your inventory",
    "there are total of 21 ores now",
    "=m"
];

function mineCommand({playerData, time}) {
    if (time - playerData.behaveTimes.mine < 3000) return {
        message: `\`Cooldown! ${(3 - (time - playerData.behaveTimes.mine)/1000).toFixed(3)} second(s) left\``
    }
    playerData.behaveTimes.mine = time;
    


    const reginOreSet = oreSet[playerData.miningRegion];

    minedOre = util.rollMine({
        reginOreSet: reginOreSet,
        luck: Math.random()*20+1,
        roll: new D(new D(10).pow(Math.random()*10))}
    );

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