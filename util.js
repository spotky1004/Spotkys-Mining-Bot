const Decimal = require("decimal.js");
const D = Decimal;

const displayModeEnum = require("./enums/displayMode.js");
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
            target[i] = [];
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
    const dec = fixedNum.mod(1).mul(1e10).toNumber()+"";

    let out = int;
    if (out.length+1 < maxLength) out = (out + "." + dec.substr(1, maxLength-int.length-1)).padEnd(maxLength, "0");
    else out = out.padEnd(maxLength, " ");

    return out;
}
function notation(x=new D(0), maxLength=6, type="Standard") {
    x = new D(x);

    if (x.lt(1000) && x.floor(0).eq(x)) {
        return (x.toNumber()+"").padEnd(maxLength, " ");
    } else if (x.eq(0)) {
        return "0".padEnd(maxLength, " ");
    }

    if (x.gt(1e90)) type = "Scientific";

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
        const [set, setId] = [Math.floor(id/100)-1, id%100];
        if (typeof sets[set] === "undefined") sets[set] = [];
        sets[set][setId] = name;
    }
    return sets;
}



/** Display Functions */
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
                
                if (!playerData.ores[oreName].eq(0)) {
                    const oreCount = ores[i] ?? new D(0);
                    const count = `${notation(playerData.ores[oreName]).padEnd(6, " ")}` + (!oreCount.eq(0) ? `(+${notation(oreCount).padEnd(6, " ")})`: " ".repeat(6));
                    message += `${oreEmoji[oreName]}\`${count}\` `;
                } else {
                    message += emojiList.blank + " ".repeat(15);
                }
                if ((p+1)%3 === 0 || displayMode === displayModeEnum.Mobile) message += "\n";
            }
            
            message = message.trim();
            break;
        default:
            return "Error";
    }
    return message;
}



module.exports = {
    /** Useful Functions */
    randomPick: randomPick,
    mergeObject: mergeObject,
    mergeArray: mergeArray,

    /** Number Functions*/
    calcStandardPrefix: calcStandardPrefix,
    numToScientDigit: numToScientDigit,
    notation: notation,

    /** Init Functions */
    enumToSets: enumToSets,

    /** Display Functions */
    oreSetToMessage: oreSetToMessage,
}