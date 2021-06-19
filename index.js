// import modules
const Discord = require("discord.js");
const fs = require("fs");
const microtime = require('microtime');
const Decimal = require("decimal.js");



const D = Decimal;
const bot = new Discord.Client();

const config = JSON.parse(fs.readFileSync("./config.json",'utf-8'));

const Permission = require("./enums/permission.js");

const util = require("./util.js");

const commands = require("./commandManager.js");
const commandDict = new Map(Object.entries(commands).map(e => e[1].keyWords.map(keyWord => [keyWord, e[0]])).flat());
const commandKeyWords = [...commandDict.keys()];


const defaulatDatas = {
    guildData: require("./saveDatas/Defaults/guildData.js"),
    userData: require("./saveDatas/Defaults/playerData.js")
};
const userPermissions = JSON.parse(fs.readFileSync("./saveDatas/permissions.json"));


let sessionData = {
    waiting: new Set()
};



bot.on("message", async (msg) => {
    if (msg.author.bot) return;

    if (sessionData.waiting.has(msg.author.id)) {
        await msg.channel.send("Wait please!\nI'm processing your request!");
    }
    sessionData.waiting.add(msg.author.id);

    const isDM = !(msg.guild);
    let guildData, prefix;
    if (!isDM) {
        guildData = checkGuildData(msg);
        prefix = guildData.prefix;
    } else {
        guildData = null;
        prefix = "+";
    }

    try {
        // init
        if (msg.content.startsWith(prefix)) {
            let playerData = checkPlayerData(msg);

            const time = new Date().getTime();
            let permissionStr = !isDM&&msg.guild.members.cache.get(msg.author.id).hasPermission("ADMINISTRATOR") ? "GuildAdmin" : "User";
            permissionStr =  userPermissions[msg.author.id] ?? permissionStr;
            const permission = Permission[permissionStr];

            // parse message
            const sentCommand = msg.content.substr(prefix.length).trim();
            const keyWord = sentCommand.split(" ")[0];
            const rawParameter = sentCommand.substr(keyWord.length).trim();

            // execute command
            if (commandKeyWords.includes(keyWord)) {
                const commandToExecute = commands[commandDict.get(keyWord)];
                const result = await commandToExecute.execute({
                    bot: bot,
                    msg: msg,
                    time: microtime.now()/1000,
                    playerData: playerData,
                    permission: permission,
                    isDM: isDM,
                    guildData: guildData,
                    rawParameter: rawParameter
                });

                playerData = result.playerData ?? playerData;

                if (!isDM) {
                    guildData.commandCounter++;
                    guildData.commandCounterToday.push(Math.floor(time/100000));
                    guildData.commandCounterToday = guildData.commandCounterToday.filter(e => e > time/100000-86400);
                    guildData.users.push(msg.author.id);
                    guildData.users = [...new Set(guildData.users)];
                    guildData.usersToday[msg.author.id] = Math.floor(time/100000);
                    for (const id in guildData.usersToday) if (guildData.usersToday[id] < time/100000-86400) delete guildData.usersToday[id];
                }
                

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

                        // send message
                        await msg.channel.send(
                            new Discord.MessageEmbed()
                            .setColor(data.color)
                            .setAuthor(data.command, data.image)
                            .addFields(...data.fields)
                            .setFooter(data.description)
                            .setTimestamp()
                        );
                    } else {
                        await msg.channel.send(result.message);
                    }
                }
            }
            
            fs.writeFileSync(`./saveDatas/playerData/${msg.author.id}.json`, JSON.stringify(playerData));
        } else if (msg.content.match(/<@&?!?763833293044711436>/) || msg.content.match(/<@&?!?763830703141945404>/)) {
            await msg.channel.send(commands.help.execute({permission: 0}).message);
        }

        // save
        if (!isDM) fs.writeFileSync(`./saveDatas/guildData/${msg.guild.id}.json`, JSON.stringify(guildData));
    } catch (e) {
        console.log(e);
    }

    sessionData.waiting.delete(msg.author.id);
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
    const path = `./saveDatas/guildData/${msg.guild.id}.json`;

    // load file
    let data;
    if (fs.existsSync(path)) {
        data = JSON.parse(fs.readFileSync(path));
    } else {
        data = {};
    }

    // check file
    data = util.mergeObject(data, defaulatDatas.guildData);

    // return
    return data;
}

function checkPlayerData(msg) {
    const path = `./saveDatas/playerData/${msg.author.id}.json`;

    // load file
    let data;
    if (fs.existsSync(path)) {
        data = JSON.parse(fs.readFileSync(path));
    } else {
        data = {};
    }

    // check file
    data = util.mergeObject(data, defaulatDatas.userData);

    // return
    return data;
}