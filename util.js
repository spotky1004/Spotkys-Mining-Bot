const fs = require("fs");
const Discord = require("discord.js");
const Decimal = require("decimal.js");
const D = Decimal;

const pickaxeEnum = require("./enums/pickaxe.js");
const displayModeEnum = require("./enums/displayMode.js");
const upgradeItemsEnum = require("./enums/upgradeItems.js");

const emojiList = require("./data/emojiList.js");

const strs = {
    blank: " ",
    sub: "└─ "
}



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
keyNameToWord = (str="") => (str.charAt(0).toUpperCase() + str.slice(1)).replace(/([A-Z])/g, " $1").trim();
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
    const dec = fixedNum.mod(1).toString().substr(2);

    let out = int;
    if (out.length+1 < maxLength) out = (out + "." + dec.substr(0, maxLength-int.length-1)).replace(/0+$/, "").padEnd(maxLength, strs.blank).replace("."+strs.blank, strs.blank);
    else out = out.padEnd(maxLength, strs.blank);

    return out;
}
function notation(x=new D(0), maxLength=6, type="Standard") {
    x = new D(x);
    
    if (x.lt(1000) && x.floor(0).eq(x)) {
        return (x.toNumber()+"").padEnd(maxLength, strs.blank);
    } else if (x.eq(0)) {
        return "0".padEnd(maxLength, strs.blank);
    } else if (x.eq(new D(Infinity))) {
        return "Inf.".padEnd(maxLength, strs.blank);
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



/** Core Functions */
const defaulatDatas = {
    guildData: require("./saveDatas/Defaults/guildData.js"),
    userData: require("./saveDatas/Defaults/playerData.js")
};
function checkGuildData(id) {
    const path = `./saveDatas/guildData/${id}.json`;

    // load file
    let data;
    if (fs.existsSync(path)) {
        data = JSON.parse(fs.readFileSync(path));
    } else {
        data = {};
    }

    // check file
    data = mergeObject(data, defaulatDatas.guildData);

    // return
    return data;
}
function checkPlayerData(id) {
    const path = `./saveDatas/playerData/${id}.json`;

    // load file
    let data;
    if (fs.existsSync(path)) {
        data = JSON.parse(fs.readFileSync(path));
    } else {
        data = {};
    }

    // check file
    data = mergeObject(data, defaulatDatas.userData);

    // return
    return data;
}


/** Game Functions */
// global
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
    LootProgressMult: (playerData) => {
        let mult = playerData.upgrade.pickaxe;
        
        return mult;
    },

    // Resource
    CoinMult: (playerData) => {
        let mult = new D(1);

        return mult;
    }
}
// mine
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
// collect
const lootProgressThreshold = [2e3, 5e3, 20e3, 50e3, 200e3, 1e6, Infinity];
calcLootTier = (lootProgress) => lootProgressThreshold.filter(e => e <= lootProgress).length-1;




/** Display Functions */
function dataToMessage({result, playerData}) {
    let message, addidion;
    addidion = result.addition ?? {};
    if (result && result.message) {
        if (typeof result.message === "object") {
            // set short name varible
            const data = result.message;

            // apply style
            switch (data.style) {
                case "list":
                    data.fields = data.fields.map(e => e = {
                        name: "· " + e.name,
                        value: "`" + e.value + "`"
                    });
                    break;
            }

            message = "";
            addidion.embed = new Discord.MessageEmbed()
                .setColor(data.color)
                .setAuthor(data.command, data.image)
                .addFields(...data.fields)
                .setFooter(data.description + ` • id: ${playerData.id}`)
                .setTimestamp();
        } else {
            message = result.message + `\n\`id: ${playerData.id}\``;
        }
    }
    

    return [message, addidion];
}
function subCommandsToTitle(subCmds) {
    if (typeof subCmds === "string") subCmds = [subCmds];
    subCmds = [...(subCmds ?? [])].filter(e => e);
    return subCmds.length ? `${strs.blank}》${strs.blank}${subCmds.join(strs.blank + "》" + strs.blank)}` : "";
}
function makeHelpFields({title, data, guildData}) {
    let fields = [];
    fields.push({
        name: `\`\`\`${title}\`\`\``,
        value: "** **",
        inline: false
    })
    for (let i = 0, l = data.length; i < l; i++) {
        const tmp = data[i];
        fields.push({
            name: `\`${guildData.prefix}${tmp.cmd}\``,
            value: `${strs.sub}_${tmp.msg}_`,
            inline: tmp.inline ?? true
        })
    }
    return fields;
}
function itemMessage({have=new D(0), got=new D(0), emoji="", isBlank=false, blankFiller=""}) {
    if (isBlank) {
        if (blankFiller) {
            return `❌\`${blankFiller.padEnd(15, strs.blank)}\``;
        } else {
            return emojiList.blank + strs.blank.repeat(15);
        }
    }

    have = new D(have);
    got  = new D(got);

    let message = emoji;
    message += "`";
    message += `${notation(have).padEnd(6, strs.blank)}`
    message += !got.eq(0) ? `(+${notation(got).padEnd(6, strs.blank)})`: strs.blank.repeat(9);
    message += "`";
    return message;
}
function oreSetToMessage({playerData, ores=[], reginOreSet=[], displayMode="Desktop"}) {
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
                    emoji: emojiList.ores[oreName],
                    isBlank: playerData.ores[oreName].eq(0)
                }) + strs.blank;

                if ((p+1)%3 === 0 || displayMode === displayModeEnum.Mobile) message += "\n";
            }
            
            message = message.trim();
            break;
        default:
            return "Error";
    }
    return message;
}
toShopNameSpace = ({emoji, shortName, level, maxLevel, name}) => `${emoji} **\`${shortName}-${level}/${maxLevel}${name ? " " + name : ""}\`**`;
function upgradeListField(upgrade, playerData, next=false) {
    const level = playerData[upgrade.parentKey][upgrade.key];

    // name
    let name;
    if (typeof upgrade.namespace === "function") name = upgrade.namespace(level);
    else name = toShopNameSpace({
        emoji: upgrade.emoji ?? "",
        shortName: upgrade.shortName,
        level: level,
        maxLevel: upgrade.maxLevel,
        name: upgrade.shortName !== upgrade.key ? keyNameToWord(upgrade.key) : ""
    });

    // value
    const effects = upgrade.effects(level);
    let nextEffect;
    if (next) nextEffect = upgrade.effects(level+1);
    
    let value = "";
    for (const name in effects) {
        value += `${keyNameToWord(name)}:` + strs.blank;
        value += `\`${upgrade.effectsFormer[name].replace(/\$/, notation(effects[name]).trim())}\``;
        if (next) value += `${strs.blank}->${strs.blank}\`${upgrade.effectsFormer[name].replace(/\$/, notation(nextEffect[name]).trim())}\``;
        value += `\n`;
    }

    const cost = upgrade.calcCost(level);
    value += `Cost:${strs.blank}\`${notation(searchObject(playerData, cost.resource))}\`/\`${notation(cost.cost)}\`${strs.blank}${searchObject(emojiList, cost.resource)}`;



    return {name, value};
}



/** Management Function */
function pathAllSave(callback) {
    const defaultSave = require("./saveDatas/Defaults/playerData.js");
    fs.readdirSync("./saveDatas/playerData").forEach(file => {
        const path = "./saveDatas/playerData/" + file;
        let playerData = mergeObject(JSON.parse(fs.readFileSync(path)), defaultSave);
        playerData = callback(playerData);
        fs.writeFileSync(path, JSON.stringify(playerData));
    });
}



module.exports = {
    strs,



    /** Useful Functions */
    randomPick,
    mergeObject,
    mergeArray,
    searchObject,
    keyNameToWord,
    


    /** Number Functions*/
    calcStandardPrefix,
    numToScientDigit,
    notation,
    


    /** Init Functions */
    enumToSets,
    dataToKeywordDictionary,



    /** Core Functions */
    defaulatDatas,
    checkGuildData,
    checkPlayerData,



    /** Game Functions */
    calcStat,
    rollMine,
    pickaxeLevels,
    calcPickaxeTier,
    getPickaxeName,
    lootProgressThreshold,
    calcLootTier,
    


    /** Display Functions */
    subCommandsToTitle,
    dataToMessage,
    makeHelpFields,
    itemMessage,
    oreSetToMessage,
    toShopNameSpace,
    upgradeListField,



    /** Management Function */
    pathAllSave,
};


// TODO: locate this require to top of this file
const upgradeItems = require("./data/upgradeItems.js");
const playerData = require("./saveDatas/Defaults/playerData.js");