const D = require("decimal.js");
const Command = require("../command.js");
const Permission = require("../Enums/permission.js");

const oreEnum = require("../enums/ore.js");

const emojiList = require("../data/emojiList.js")
const blankEmoji = emojiList.blank;
const oreEmoji = emojiList.ore;

let oreSet = [];
for (const oreName in oreEnum) {
    const oreId = oreEnum[oreName];
    const [set, setId] = [Math.floor(oreId/100)-1, oreId%100];
    if (typeof oreSet[set] === "undefined") oreSet[set] = [];
    oreSet[set][setId] = oreName;
}

function mineCommand({msg, playerData}) {
    const miningRegion = 0;
    const reginOreSet = oreSet[miningRegion];


    
    let minedOre = Array.from({length: reginOreSet.length}, (_, i) => Math.random() > 0.5 ? new D(i+1) : new D(0));
    /* TODO: ore mine formula */



    let oreMsg = "";
    for (let p = 0, l = minedOre.length; p < l; p++) {
        const i = (p%3*7)+Math.floor(p/3);
        const oreName = reginOreSet[i];

        // oreMsg
        const oreCount = minedOre[i];
        if (!oreCount.eq(0)) {
            const count = `${playerData.ores[oreName].padEnd(6, " ")}(+${oreCount.toString().padEnd(6, " ")})`;
            oreMsg += `${oreEmoji[oreName]}\`${count}\` `;
        } else {
            oreMsg += blankEmoji + " ".repeat(15);
        }
        if ((p+1)%3 === 0) oreMsg += "\n";
        
        // playerData
        
    }
    oreMsg = oreMsg.trim();
    console.log(oreMsg.length);



    return {
        playerData: playerData,
        message: {
            command: "Mine",
            color: "#e0931f",
            image: "https://i.imgur.com/xAZJT1w.png",
            fields: [
                {
                    name: "You got:",
                    value: oreMsg
                }
            ],
            description: "Mine!"
        }
    }
}

module.exports = new Command({
    keyWords: ["mine", "m", "M", "MINE", "ㅡ"],
    regex: null,
    func: mineCommand,
    permissionReq: Permission.User
});