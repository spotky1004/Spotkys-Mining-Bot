// import modules
const Discord = require("discord.js");
const fs = require("fs");
const Decimal = require("decimal.js");

// module init
global.D = Decimal;
const bot = new Discord.Client();

// 
const config = JSON.parse(fs.readFileSync("./config.json",'utf-8'));

const commands = require("./commandManager.js");
const commandDict = new Map(Object.entries(commands).map(e => e[1].keyWords.map(keyWord => [keyWord, e[0]])).flat());
const commandKeyWords = [...commandDict.keys()];


const defaulatDatas = {
    guildData: require("./saveDatas/Defaults/guildData.js")
}


let sessionData = {};

bot.on("message", (msg) => {
    if (msg.author.bot) return;


    
    // message
    const guildData = checkGuildData(msg);
    const prefix = guildData.prefix;

    if (msg.content.startsWith(prefix)) {
        // parse message
        const sentCommand = msg.content.substr(prefix.length).trim();
        const keyWord = sentCommand.split(" ")[0];
        const rawParameter = sentCommand.substr(keyWord.length).trim();

        // execute command
        if (commandKeyWords.includes(keyWord)) {
            const commandToExecute = commands[commandDict.get(keyWord)];
            const result = commandToExecute.execute({
                msg: msg,
                rawParameter: rawParameter
            });

            if (result && result.message) {
                msg.channel.send(result.message);

                guildData.commandCounter++;
                guildData.users.push(msg.author.id);
                guildData.users = [...new Set(guildData.users)];
            }
        }
    } else if (msg.content.match(/<@&?!?763833293044711436>/)) {
        msg.channel.send(commands.help.execute({}).message);
    }



    // save
    fs.writeFileSync(`./saveDatas/guildData/${msg.guild.id}.json`, JSON.stringify(guildData));
});

bot.on("ready", function() {
    console.log("login!");

    bot.user.setPresence({
        status: 'online',
        activity: {
            name: "Ping me to open help!",
            type: 'WATCHING',
        }
    });
});

bot.login(config.token);


function checkGuildData(msg) {
    const guildId = msg.guild.id;
    const path = `./saveDatas/guildData/${guildId}.json`;

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

function mergeObject(target, souce) {
    for (const i in souce) {
        if (target[i] instanceof Decimal) {
            target[i] = new D(target[i] ?? souce[i]);
        } else if (Array.isArray(target[i])) {
            target[i] = ([...target[i]] ?? []).concat(souce[i].slice(target[i].length));
        } else if (typeof target[i] === "object") {
            target[i] = mergeObject(target[i]);
        } else {
            target[i] = target[i] ?? souce[i];
        }
    }
    return target;
}