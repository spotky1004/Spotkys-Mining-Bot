const D = require("decimal.js");

const util = require("../util.js");
const emojiList = require("../data/emojiList.js");
const imageList = require("../data/imageList.js");
const colorSet = require("../data/colorSet.js");

const artifactItems = require("../data/artifactItems.js");
const artifactEnum = require("../enums/artifact.js");
const artifactSet = util.enumToSets(artifactEnum);

const oreEnum = require("../enums/ore.js");
const oreSet = util.enumToSets(oreEnum);

const skillEnum = require("../enums/skill.js");
const skillSet = util.enumToSets(skillEnum);

class Loot {
    constructor({
        key, keyWords, dynamicLoot,
        // Loots
        coinRange, mineRange, gemRange, skills, skillRange, artifacts, 
    }) {
        this.key = key;
        this.keyWords = keyWords;

        this.dynamicLoot = dynamicLoot ?? false;
        this.coinRange = coinRange ?? {min: 0, max: 0};
        this.mineRange = mineRange ?? {min: 0, max: 0};
        this.gemRange = gemRange ?? {min: 0, max: 0};
        this.skills = (skills ?? []).map(e => typeof e === "object" ? Array(e.c).fill(e.e) : e).flat();
        this.skillRange = skillRange ?? {min: 1, max: 1};
        this.artifacts = artifacts ?? [];
    }
    key = new String;
    keyWords = new Array;
    coinRange = new Object;
    mineRange = new Object;
    gemRange = new Object;
    skill = new Array;
    skillRange = new Object;
    artifacts = new Array;

    lootTable(playerData) {
        let fields = [];

        // this.mineRange
        if (this.mineRange.max) {
            let dynamicMultiplier = this.dynamicLoot ? util.calcStat.DynamicRollMult(playerData) : 1;
            fields.push({
                name: emojiList.pickaxe.StonePickaxe + " Mine Roll",
                value: `\`${util.notation(this.mineRange.min*dynamicMultiplier)}\` ~ \`${util.notation(this.mineRange.max*dynamicMultiplier)}\``
            });
        }

        // this.gemRange
        if (this.gemRange.max) {
            let dynamicMultiplier = this.dynamicLoot ? util.calcStat.DynamicGemMult(playerData) : 1;
            fields.push({
                name: emojiList.gem +  " Gem",
                value: `\`${util.notation(this.gemRange.min*dynamicMultiplier)}\` ~ \`${util.notation(this.gemRange.max*dynamicMultiplier)}\``
            });
        }

        // this.skillRange
        if (this.skills.length > 0) fields.push({
            name: emojiList.skill +  " Skill",
            value: Object.entries(util.arrayCounter(this.skills)).map(e => `- ${emojiList.skills[skillSet[e[0]]]} ${util.keyNameToWord(skillSet[e[0]])} \`${(e[1]/this.skills.length*100).toFixed(2)}%\``).join("\n")
        });

        // this.artifacts
        let artifactMsg = "";
        for (let i = 0, l = this.artifacts.length; i < l; i++) {
            const artifactNr = typeof this.artifacts[i] === "object" ? this.artifacts[i].nr : this.artifacts[i];
            const artifactName = artifactSet[artifactNr];
            const artifact = artifactItems[artifactName];

            const chanceMult = typeof this.artifacts[i] === "object" ? this.artifacts[i].mul : 1;

            artifactMsg += artifact.namespace(playerData, chanceMult) + `${chanceMult !== 1 ? ` \`(x${chanceMult})\`` : ""}\n`;
        }
        if (artifactMsg) fields.push({
            name: emojiList.ancientCoin +  " Artifacts",
            value: artifactMsg.trim()
        });

        return fields;
    }

    open(count, playerData) {
        const dynamicRollMult = this.dynamicLoot ? util.calcStat.DynamicRollMult(playerData): 1;
        const oreRollCount = Math.floor(util.randomRange(this.mineRange.min*dynamicRollMult, this.mineRange.max*dynamicRollMult, count));
        const oreGot = util.rollMine({
            roll: oreRollCount,
            playerData,
            luck: util.calcStat.Luck(playerData),
            reginOreSet: oreSet[playerData.miningRegion]
        });

        let dynamicGemMult = this.dynamicLoot ? util.calcStat.DynamicGemMult(playerData): 1;
        const gemGot = Math.floor(util.randomRange(this.gemRange.min*dynamicGemMult, this.gemRange.max*dynamicGemMult, count));

        const skillGot = util.arrayCounter( Array.from({length: count}, () => util.randomPick(this.skills)).filter(e => e !== -1) );

        let artifactGot = Object.fromEntries(this.artifacts.map(e => [typeof e === "object" ? e.nr : e, 0]));
        Array.from({length: count}, () => {
            let allSuccss = [];
            for (let i = 0, l = this.artifacts.length; i < l; i++) {
                const artifactNr = typeof this.artifacts[i] === "object" ? this.artifacts[i].nr : this.artifacts[i];
                const artifactName = artifactSet[artifactNr];
                const artifact = artifactItems[artifactName];

                const chanceMult = typeof this.artifacts[i] === "object" ? this.artifacts[i].mul : 1;
                const chance = artifact.realGetChance(playerData, chanceMult, artifactGot[artifactNr]);

                if (Math.random() < chance) allSuccss.push({nr: artifactNr, chance: chance});
            }

            if (allSuccss.length === 0) return -1;
            const gotNr = allSuccss.sort((a, b) => a.chance - b.chance)[0].nr;
            artifactGot[gotNr]++;
            return gotNr;
        }).filter(e => e !== -1);

        /** 
         * @param {number} oreRollCount
         * @param {Array<number>} oreGot
         * @param {number} gemGot
         * @param {object<number>} skillGot
         * @param {object<number>} artifactGot
         * @return {object}
         */
        return {
            oreRollCount,
            oreGot,
            gemGot,
            skillGot,
            artifactGot
        };
    }
}

module.exports = Loot;