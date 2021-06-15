// import modules
const Discord = require("discord.js");
const fs = require("fs");
const Decimal = require("decimal.js");

// module init
global.D = Decimal;
const bot = new Discord.Client();

const config = JSON.parse(fs.readFileSync("./config.json",'utf-8'));

const Permission = require("./Enums/permissionEnum.js");

const commands = require("./commandManager.js");
const commandDict = new Map(Object.entries(commands).map(e => e[1].keyWords.map(keyWord => [keyWord, e[0]])).flat());
const commandKeyWords = [...commandDict.keys()];


const defaulatDatas = {
    guildData: require("./saveDatas/Defaults/guildData.js")
};
const userPermissions = JSON.parse(fs.readFileSync("./saveDatas/permissions.json"));


let sessionData = {};

bot.on("message", (msg) => {
    if (msg.author.bot) return;



    // init
    const guildData = checkGuildData(msg);
    const prefix = guildData.prefix;
    const time = new Date().getTime();
    let permissionStr = msg.guild.members.cache.get(msg.author.id).hasPermission("ADMINISTRATOR") ? "GuildAdmin" : "User";
    permissionStr = userPermissions[msg.author.id];
    const permission = Permission[permissionStr];

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
                permission: permission,
                guildData: guildData,
                rawParameter: rawParameter
            });

            guildData.commandCounter++;
            guildData.commandCounterToday.push(Math.floor(time/1000));
            guildData.commandCounterToday = guildData.commandCounterToday.filter(e => e > time/1000-86400);
            guildData.users.push(msg.author.id);
            guildData.users = [...new Set(guildData.users)];
            guildData.usersToday[msg.author.id] = time/1000;
            for (const id in guildData.usersToday) if (guildData.usersToday[id] < time/1000-86400) delete guildData.usersToday[id];

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
                    msg.channel.send(
                        new Discord.MessageEmbed()
                        .setColor(data.color)
                        .setAuthor(data.command, data.image)
                        .addFields(...data.fields)
                        .setFooter(data.description)
                        .setTimestamp()
                    );
                } else {
                    msg.channel.send(result.message);
                }
            }
        }
    } else if (msg.content.match(/<@&?!?763833293044711436>/) || msg.content.match(/<@&?!?763830703141945404>/)) {
        msg.channel.send(commands.help.execute({permission: permission}).message);
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