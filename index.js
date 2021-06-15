// import modules
const Discord = require("discord.js");
const fs = require("fs");
const Decimal = require("decimal.js");

// module init
global.D = Decimal;
const bot = new Discord.Client();

const config = JSON.parse(fs.readFileSync("./config.json",'utf-8'));

const Permission = require("./enums/permission.js");

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



    try {
        // init
        const guildData = checkGuildData(msg);
        const playerData = checkPlayerData(msg);

        const prefix = guildData.prefix;
        const time = new Date().getTime();
        let permissionStr = msg.guild.members.cache.get(msg.author.id).hasPermission("ADMINISTRATOR") ? "GuildAdmin" : "User";
        permissionStr =  userPermissions[msg.author.id] ?? permissionStr;
        const permission = Permission[permissionStr];

        if (msg.content.startsWith(prefix)) {
            // parse message
            const sentCommand = msg.content.substr(prefix.length).trim();
            const keyWord = sentCommand.split(" ")[0];
            const rawParameter = sentCommand.substr(keyWord.length).trim();

            // execute command
            if (commandKeyWords.includes(keyWord)) {
                const commandToExecute = commands[commandDict.get(keyWord)];
                const result = await commandToExecute.execute({
                    msg: msg,
                    permission: permission,
                    guildData: guildData,
                    rawParameter: rawParameter
                });

                guildData.commandCounter++;
                guildData.commandCounterToday.push(Math.floor(time/100000));
                guildData.commandCounterToday = guildData.commandCounterToday.filter(e => e > time/100000-86400);
                guildData.users.push(msg.author.id);
                guildData.users = [...new Set(guildData.users)];
                guildData.usersToday[msg.author.id] = Math.floor(time/100000);
                for (const id in guildData.usersToday) if (guildData.usersToday[id] < time/100000-86400) delete guildData.usersToday[id];

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
        } else if (msg.content.match(/<@&?!?763833293044711436>/) || msg.content.match(/<@&?!?763830703141945404>/)) {
            await msg.channel.send(commands.help.execute({permission: permission}).message);
        }

        // save
        fs.writeFileSync(`./saveDatas/guildData/${msg.guild.id}.json`, JSON.stringify(guildData));
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
    data = mergeObject(data, defaulatDatas.guildData);

    // return
    return data;
}

function checkPlayerData(msg) {
    const path = `./saveDatas/playerData/${msg.author.id}.json`;
}

function mergeObject(target, source) {
    target = target ?? {};
    for (const i in source) {
        if (target[i] instanceof Decimal) {
            target[i] = new D(target[i] ?? source[i]);
        } else if (Array.isArray(target[i])) {
            mergeArray(target[i], source[i])
            target[i] = ([...target[i]] ?? []).concat(source[i].slice(target[i].length));
        } else if (typeof target[i] === "object") {
            target[i] = mergeObject(target[i]);
        } else {
            target[i] = target[i] ?? source[i];
        }
    }
    return target;
}

function mergeArray(target, source) {
    target = (target ?? []).concat(source.slice(target.length));;
    for (let i = 0, l = source.length; i < l; i++) {
        if (target[i] instanceof Decimal) {
            target[i] = new D(target[i] ?? source[i]);
        } else if (Array.isArray(target[i])) {
            mergeArray(target[i], source[i])
        } else if (typeof target[i] === "object") {
            target[i] = mergeObject(target[i]);
        } else {
            target[i] = target[i] ?? source[i];
        }
    }
}