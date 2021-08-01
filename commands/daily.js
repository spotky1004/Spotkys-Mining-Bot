const Decimal = require("decimal.js");

const Command = require("../class/command.js");
const Cooldown = require("../class/cooldown.js");
const Permission = require("../enums/permission.js");
const util = require("../util.js");

const emojiList = require("../data/emojiList.js");
const colorSet = require("../data/colorSet.js");
const imageList = require("../data/imageList.js");

const dailyCooldown = new Cooldown(20*3600_000);

const randomTips = [
    "Daily reward!",
    "See u tomorrow!",
    "See you tommorrow!",
    "hi",
    "=d",
];

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function dailyCommand({ playerData, time }) {
    let fields = [], description;

    for (let day = playerData.dailyCollected; day < playerData.dailyCollected+3; day++) {
        const data = dailyReward(day, playerData);
        fields.push(dailyRewardAsField(data));
    }

    if (!dailyCooldown.isDone(playerData.behaveTimes.daily)) {
        description = "Next daily reward in: " + dailyCooldown.format(playerData.behaveTimes.daily);
    } else {
        // Chance Field name
        fields[0].name = `\`${fields[0].name}\` 🎉`;

        // Set variables
        playerData.dailyCollected++;
        playerData.behaveTimes.daily = time;

        // Reward give
        const data = dailyReward(playerData.dailyCollected, playerData);
        for (let i = 0; i < data.rewards.length; i++) {
            const reward = data.rewards[i];

            const parent = util.searchObject(playerData, reward.resource.splice(0, reward.resource.length-1));
            const resourceName = reward.resource[reward.resource.length-1];

            const amount = reward.amount;
            if (amount instanceof Decimal) {
                parent[resourceName] = parent[resourceName].add(amount);
            } else {
                parent[resourceName] += amount;
            }
        }
    }



    return {
        message: {
            command: "Daily",
            image: imageList.loots.DailyBag,
            color: colorSet.Pink,
            fields: fields,
            footer: util.randomPick(randomTips),
            description: description ?? undefined
        }
    }
}


/**
 * @param {number} day 
 * @return { {day: number, mult: number, rewards: [{name: string, amount: number, resource: string[], description?: string}]} }
 */
function dailyReward(day, playerData) {
    let data = {
        day,
        mult: util.calcStat.DailyRewardMult(playerData),
        rewards: [],
    };

    const rewards = data.rewards;
    rewards.push({
        name: "DailyBag",
        amount: (day%31+1).toString(2).replace(/0/g, "").length,
        resource: ["loots", "DailyBag"],
    });
    if (day%3 === 2) {
        rewards.push({
            name: "Gem",
            description: "based on progress",
            amount: Math.floor( Math.floor(day/3+1).toString(2).replace(/0/g, "").length * util.calcStat.DynamicGemMult(playerData) ),
            resource: ["gem"]
        });
    }

    // Apply DailyRewardMult to all resources
    rewards.map(e => e = {
        ...e,
        amount: e.amount*data.mult
    });

    return data;
}

/** @param {dailyReward.return} data */
// ^ I need to fix this
function dailyRewardAsField(data) {
    let msg = "";

    for (let i = 0; i < data.rewards.length; i++) {
        const reward = data.rewards[i];

        msg += util.itemMessage({
            emoji: util.searchObject(emojiList, reward.resource),
            have: reward.amount
        });
        msg += reward.description ? ` _${reward.description}_` : "";
        msg += "\n";
    }

    return {
        name: `Day ${data.day}`,
        value: msg.trim()
    };
}

module.exports = new Command({
    keyWords: ["daily", "DAILY", "d", "D", "ㅇ"],
    func: dailyCommand,
    permissionReq: Permission.User
});