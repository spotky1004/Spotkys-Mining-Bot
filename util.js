const Decimal = require("decimal.js");
const D = Decimal;

const pickaxeEnum = require("./enums/pickaxe.js");
const displayModeEnum = require("./enums/displayMode.js");
const upgradeItemsEnum = require("./enums/upgradeItems.js");

const emojiList = require("./data/emojiList.js");



/** Useful Functions */
function randomPick(arr=[]) {
    return arr[Math.floor(Math.random()*arr.length)];
}
function mergeObject(target, source) {
    target = target ?? {};
    for (const i in source) {
        if (source[i] instanceof Decimal) {
            target[i] = new D(target[i] ?? source[i]);
        } else if (Array.isArray(source[i])) {
            target[i] = target[i] ?? [];
            mergeArray(target[i], source[i])
        } else if (typeof source[i] === "object") {
            target[i] = mergeObject(target[i], source[i]);
        } else {
            target[i] = target[i] ?? source[i];
        }
    }
    return target;
}
function mergeArray(target, source) {
    for (let i = 0, l = source.length; i < l; i++) {
        if (source[i] instanceof Decimal) {
            target[i] = new D(target[i] ?? source[i]);
        } else if (Array.isArray(source[i])) {
            mergeArray(target[i], source[i]);
        } else if (typeof source[i] === "object") {
            target[i] = mergeObject(target[i], source[i]);
        } else {
            target[i] = target[i] ?? source[i];
        }
    }
    return target;
}
keyNameToWord = (str) => str.replace(/([A-Z])/g, " $1").trim();
function searchObject(obj, toSearch) {
    let tmp = obj;
    for (let i = 0, l = toSearch.length; i < l; i++) {
        if (typeof tmp === "object") tmp = tmp[toSearch[i]];
        else return undefined;
    }
    return tmp;
}




/** Number Functions*/
const notationTypes = require("./enums/notationTypes.js");
const notationDatas = {
    Standard: [
        [ "K",   "M",   "B",   "T",  "QA",  "QI",  "SX",  "SP",   "O",   "N"],
        [  "",   "U",   "D",   "T",  "QA",  "QI",  "SX",  "SP",  "OC",  "NO"],
        [  "",   "D",   "V",  "TG", "QAG", "QIG", "SXG", "SPG", "OCG", "NOG"],
        [  "",  "CT",  "DE",  "TC",  "QT",  "QN",  "SS",  "SI",  "OE",  "NI"]
    ]
};
function calcStandardPrefix(x) {
    const p = notationDatas.Standard;
    x = new D(x);
    if (x.lt(1000)) return "";
    lgkx = x.log(1000).floor(0).sub(1).toNumber();
    return (lgkx < 10 ? p[0] : p[1])[lgkx%10] + p[2][Math.floor(lgkx/10)%10] + p[3][Math.floor(lgkx/100)%10];
}
function numToScientDigit(x, maxLength=6) {
    x = new D(x);

    const fixedNum = x.div(new D(1000).pow(x.log(1000).floor(0)));
    const int = fixedNum.floor(0).toNumber()+"";
    const dec = fixedNum.mod(1).mul(1e6).toNumber()+"";

    let out = int;
    if (out.length+1 < maxLength) out = (out + "." + dec.substr(0, maxLength-int.length-1)).replace(/0+$/, "").padEnd(maxLength, " ");
    else out = out.padEnd(maxLength, " ");

    return out;
}
function notation(x=new D(0), maxLength=6, type="Standard") {
    x = new D(x);
    
    if (x.lt(1000) && x.floor(0).eq(x)) {
        return (x.toNumber()+"").padEnd(maxLength, " ");
    } else if (x.eq(0)) {
        return "0".padEnd(maxLength, " ");
    } else if (x.eq(new D(Infinity))) {
        return "Inf.".padEnd(maxLength, " ");
    }

    if (x.gt("1e3000")) type = "Scientific";

    let out;
    switch (notationTypes[type]) {
        case notationTypes.Standard:
            const prefix = calcStandardPrefix(x);
            out = numToScientDigit(x, maxLength-prefix.length) + prefix;
            break;
        case notationTypes.Scientific:
            out = numToScientDigit(x, maxLength) + "e" + x.log(1000).floor(0).mul(3);
            break;
        default:
            out = "Error.";
            break;
    }

    return out;
}



/** Init Functions */
function enumToSets(e) {
    let sets = [];
    for (const name in e) {
        const id = e[name];
        if (id >= 100) {
            const [set, setId] = [Math.floor(id/100)-1, id%100];
            if (typeof sets[set] === "undefined") sets[set] = [];
            sets[set][setId] = name;
        } else {
            sets[id] = name;
        }
    }
    return sets;
}
function dataToKeywordDictionary(data) {
    const Dictionary =  new Map(Object.entries(data).map(e => e[1].keyWords.map(keyWord => [keyWord, e[0]])).flat());
    const KeyWords = [...Dictionary.keys()];

    return {
        Dictionary,
        KeyWords
    };
}



/** Game Functions */
function rollMine({reginOreSet=[], roll=new D(1), luck=1}) {
    roll = new D(roll);

    let minedOre = Array.from({length: reginOreSet.length}, e => new D(0));

    minedOre[0] = roll;

    oreDistribution = 2;
    luck = luck ?? 1;
    for (let i = 1; i < luck; i++) {
        const tmpDistribution = Math.max(1, oreDistribution*(1+Math.random()*0.03)+(Math.random()*0.05));
        minedOre[i] = minedOre[i-1].div(tmpDistribution).mul(Math.min(1, luck-i));
    }
    
    minedOre = minedOre.map(e => e.gt(1) || e.gt(Math.random()) ? e.ceil(0) : new D(0));

    return minedOre;
}
const pickaxeLevels = [10, 30, 60, 100, 150, 250];
const pickaxeName = Object.keys(pickaxeEnum).map(keyNameToWord);
calcPickaxeTier = (level) => pickaxeLevels.filter(e => e < level).length;
getPickaxeName  = (level) => pickaxeName[calcPickaxeTier(level)];
const calcStat = {
    // Mining
    Roll: (playerData) => {
        const pickaxeEffect = upgradeItems[upgradeItemsEnum.pickaxe].effects(playerData.upgrade.pickaxe);

        let min = pickaxeEffect.RollMin;
        let max = pickaxeEffect.RollMax;

        return {min, max};
    },
    Luck: (playerData) => {
        return upgradeItems[upgradeItemsEnum.pickaxe].effects(playerData.upgrade.pickaxe).Luck;
    },
    MiningCooldown: (playerData) => {
        return 3000;
    },

    // Autominer
    AutominerSpeed: (playerData) => {
        let speed = upgradeItems[upgradeItemsEnum.autominerSpeed].effects(playerData.upgrade.autominerSpeed).Interval;

        speed *= 1000;
        return speed;
    },
    AutominerCap: (playerData) => {
        let cap = 1;

        cap *= 3600*1000;
        return cap;
    },

    // Resource
    CoinMult: (playerData) => {
        let mult = new D(1);

        return mult;
    }
}



/** Display Functions */
function itemMessage({have=new D(0), got=new D(0), emoji="", isBlank=false}) {
    if (isBlank) return emojiList.blank + " ".repeat(15);

    have = new D(have);
    got  = new D(got);

    let message = emoji;
    message += "`";
    message += `${notation(have).padEnd(6, " ")}`
    message += !got.eq(0) ? `(+${notation(got).padEnd(6, " ")})`: " ".repeat(9);
    message += "`";
    return message;
}
function oreSetToMessage({playerData, ores=[], reginOreSet=[], oreEmoji={}, displayMode="Desktop"}) {
    displayMode = displayModeEnum[displayMode];

    ores = ores ?? [];

    let message = "";
    switch (displayMode) {
        case displayModeEnum.Desktop: case displayModeEnum.Mobile:
            message = "";

            for (let p = 0, l = ores.length; p < l; p++) {
                let i;
                if (displayMode === displayModeEnum.Desktop) i = (p%3*7)+Math.floor(p/3);
                else i = p;
                
                const oreName = reginOreSet[i];
                
                message += itemMessage({
                    have : playerData.ores[oreName],
                    got  : ores[i] ?? new D(0),
                    emoji: oreEmoji[oreName],
                    isBlank: playerData.ores[oreName].eq(0)
                }) + " ";

                if ((p+1)%3 === 0 || displayMode === displayModeEnum.Mobile) message += "\n";
            }
            
            message = message.trim();
            break;
        default:
            return "Error";
    }
    return message;
}
toShopNameSpace = ({emoji, shortName, level, maxLevel, name}) => `${emoji} **\`${shortName}-${level}/${maxLevel} ${name}\`**`;
function upgradeListMessage(upgrade, level, playerData, next=false) {
    const effects = upgrade.effects(level);
    let nextEffect;
    if (next) nextEffect = upgrade.effects(level+1);
    
    let message = "";
    for (const name in effects) {
        message += `${keyNameToWord(name)}: `;
        message += `\`${upgrade.effectsFormer[name].replace(/\$/, notation(effects[name]).trim())}\``;
        if (next) message += ` -> \`${upgrade.effectsFormer[name].replace(/\$/, notation(nextEffect[name]).trim())}\``;
        message += `\n`;
    }

    const cost = upgrade.calcCost(level);
    message += `Cost: \`${notation(searchObject(playerData, cost.resource))}\` / \`${notation(cost.cost)}\` ${searchObject(emojiList, cost.resource)}`;

    return message.trim();
}



module.exports = {
    /** Useful Functions */
    randomPick,
    mergeObject,
    mergeArray,
    searchObject,
    
    /** Number Functions*/
    calcStandardPrefix,
    numToScientDigit,
    notation,
    
    /** Init Functions */
    enumToSets,
    dataToKeywordDictionary,

    /** Game Functions */
    rollMine,
    pickaxeLevels,
    calcPickaxeTier,
    getPickaxeName,
    calcStat,
    
    /** Display Functions */
    itemMessage,
    oreSetToMessage,
    toShopNameSpace,
    upgradeListMessage,
};


// TODO: locate this require to top of this file
const upgradeItems = require("./data/upgradeItems.js");
const playerData = require("./saveDatas/Defaults/playerData.js");
