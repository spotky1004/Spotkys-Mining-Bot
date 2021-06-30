const Artifact = require("../class/artifact.js");

let artifactItems = {};



/**
 *  from Artifact Shop
 */
artifactItems.MiningLantern = new Artifact({
    key: "MiningLantern",
    effects: function(level) {
        return 0.02*level
    },
    unlockMessage: "Artifact Shop",
    effectsFormer: "Reduce Ore Distribution by $(-0.02 per)",
    maxLevel: 10
});



/**
 *  from Loot
 */
artifactItems.OldCalendar = new Artifact({
    key: "OldCalendar",
    effects: function(level) {
        return 10*level
    },
    unlockMessage: "Loot",
    effectsFormer: "Multiply pickaxe roll by $% (+10% per artifact)",
    maxLevel: 50,
    getChance: (lv) => 1/Math.sqrt(lv+1)
});

module.exports = artifactItems;