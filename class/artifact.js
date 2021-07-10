const emojiList = require("../data/emojiList.js");
const util = require("../util.js");

const artifactEnum = require("../enums/artifact.js");

class Artifact {
    constructor ({
        key, maxLevel, unlockMessage, effectsFormer,
        effects, getChance, staticChance
    }) {
        this.key = key ?? "artifactName";
        this.maxLevel = maxLevel ?? 0;
        this.unlockMessage = unlockMessage ?? "";
        this.effectsFormer = effectsFormer ?? "$";

        this.effects = effects ?? (() => {return {}});
        this.getChance = getChance ?? (() => {return 0});
        this.staticChance = staticChance;
    }
    name = new String;
    maxLevel = new Number;
    unlockMessage = new String;
    effectsFormer = new String;
    effects = new Function;
    getChance = new Function;
    staticChance = new Boolean;

    namespace(playerData, chanceMult=1) {
        const artifactName = this.key;
        const artifactLevel = playerData.artifact[artifactName];
        const unlocked = artifactLevel >= 1;
        
        let name = "";
        name += `\`#${(artifactEnum[this.key]+1).toString().padStart(2, " ")}\``;
        name += " " + (unlocked ? emojiList.artifact[artifactName] : emojiList.loots.CommonBox);
        name += " " + (unlocked ? util.keyNameToWord(artifactName) : util.keyNameToWord(artifactName).replace(/[^ ]/g, "?"));
        name += " " + (unlocked ? `(${artifactLevel}/${this.maxLevel})` : "");
        const chance = this.realGetChance(playerData, chanceMult);
        name += unlocked && chance !== 0 ? ` \`${(chance*100).toFixed(2)}%\`` : "";

        return name;
    }

    listField(playerData) {
        const artifactName = this.key;
        const artifactLevel = playerData.artifact[artifactName];
        const unlocked = artifactLevel >= 1;

        let name = this.namespace(playerData);

        let value = "";
        value += util.strs.sub;
        let artifactEffect = this.effects(artifactLevel);
        if (typeof artifactEffect === "number") {
            artifactEffect = util.notation(artifactEffect, 3, "Decimal");
        } else {
            artifactEffect = artifactEffect.map(e => util.notation(e, 3, "Decimal"));
        }
        value += unlocked ? util.textFormer(this.effectsFormer, artifactEffect) : "Unlock";

        return {name, value};
    }

    realGetChance(playerData, chanceMult=1, levelShift=0) {
        if (this.staticChance) return this.getChance(playerData.artifact[this.key], playerData);
        if (playerData.artifact[this.key]+levelShift >= this.maxLevel) return 0;
        return this.getChance(playerData.artifact[this.key]+levelShift, playerData) * util.calcStat.ArtifactChanceMult(playerData) * chanceMult;
    }

    roll(playerData, chanceMult=1) {
        const chance = this.realGetChance(playerData, chanceMult);
        const success = playerData.artifact[this.key] < this.maxLevel && chance > Math.random();

        if (success && playerData) playerData.artifact[this.key]++;

        return {
            success,
            playerData,
            message: util.itemMessage({
                have: playerData.artifact[this.key],
                emoji: emojiList.artifact[this.key],
                got: Number(success),
                isBlank: !success,
                blankFiller: "no artifact"
            }) + chance !== 0 ? ` \`Chance: ${(chance*100).toFixed(2).padStart(6, " ")} %\`` : ""
        }
    }

    eff(playerData) {
        return this.effects(playerData.artifact[this.key]);
    }
}

module.exports = Artifact;