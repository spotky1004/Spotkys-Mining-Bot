const emojiList = require("../data/emojiList.js")
const util = require("../util.js");

class Artifact {
    constructor ({
        key, maxLevel, unlockMessage, effectsFormer,
        effects, getChance
    }) {
        this.key = key ?? "artifactName";
        this.maxLevel = maxLevel ?? 0;
        this.unlockMessage = unlockMessage ?? "";
        this.effectsFormer = effectsFormer ?? "$";

        this.effects = effects ?? (() => {return {}});
        this.getChance = getChance ?? (() => {return 0});
    }
    name = new String();
    maxLevel = new Number();
    unlockMessage = new String();
    effectsFormer = new String();
    effects = new Function();
    getChance = new Function();

    roll(playerData) {
        const chance = this.getChance(playerData.artifact[this.key], playerData);
        const success = playerData.artifact[this.key] < this.maxLevel && this.getChance(playerData.artifact[this.key], playerData) > Math.random();

        if (success) playerData.artifact[this.key]++;

        return {
            success,
            playerData,
            message: util.itemMessage({
                have: playerData.artifact[this.key],
                emoji: emojiList.artifact[this.key],
                got: Number(success),
                isBlank: !success,
                blankFiller: "no artifact"
            }) + ` \`Chance: ${(chance*100).toFixed(2)} %\``
        }
    }
}

module.exports = Artifact;