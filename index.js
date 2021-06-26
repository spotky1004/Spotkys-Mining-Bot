// import modules
const Discord = require("discord.js");
const bot = new Discord.Client();
const disbut = require("discord-buttons");
const fs = require("fs");
const microtime = require('microtime');
const Decimal = require("decimal.js");



disbut(bot); // disbut bind

const D = Decimal;

const config = JSON.parse(fs.readFileSync("./config.json",'utf-8'));

const Permission = require("./enums/permission.js");

const util = require("./util.js");

const commands = require("./commandManager.js");
const commandDict     = util.dataToKeywordDictionary(commands).Dictionary;
const commandKeyWords = util.dataToKeywordDictionary(commands).KeyWords;

const userPermissions = JSON.parse(fs.readFileSync("./saveDatas/permissions.json"));


let sessionData = {
    waiting: new Set()
};



bot.on("message", async (msg) => {
    if (msg.author.bot) return;

    if (sessionData.waiting.has(msg.author.id)) {
        await msg.channel.send("Wait please!\nI'm processing your request!");
        return;
    }
    sessionData.waiting.add(msg.author.id);

    try {
        const isDM = !(msg.guild);
        let guildData, prefix;
        if (!isDM) {
            guildData = await util.checkGuildData(msg.guild.id);
            prefix = guildData.prefix;
        } else {
            guildData = null;
            prefix = "+";
        }

        // init
        if (msg.content.startsWith(prefix)) {
            let playerData = await util.checkPlayerData(msg.author.id);

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
                    bot,
                    msg,
                    playerData,
                    guildData,
                    permission,
                    isDM,
                    rawParameter,
                    disbut,
                    time: microtime.now()/1000,
                });

                playerData = result.playerData ?? playerData;

                if (!isDM) {
                    guildData.commandCounter++;
                    guildData.commandCounterToday.push(Math.floor(time/1000));
                    guildData.commandCounterToday = guildData.commandCounterToday.filter(e => e > time/1000-86400);
                    guildData.users.push(msg.author.id);
                    guildData.users = [...new Set(guildData.users)];
                    guildData.usersToday[msg.author.id] = Math.floor(time/1000);
                    for (const id in guildData.usersToday) if (guildData.usersToday[id] < time/1000-86400) delete guildData.usersToday[id];
                }
                
                msg.channel.send(...util.dataToMessage(result));
            }
            
            // save
            fs.writeFileSync(`./saveDatas/playerData/${msg.author.id}.json`, JSON.stringify(playerData));
            if (!isDM) fs.writeFileSync(`./saveDatas/guildData/${msg.guild.id}.json`, JSON.stringify(guildData));
        } else if (msg.content.match(/<@&?!?763833293044711436>/) || msg.content.match(/<@&?!?763830703141945404>/)) {
            await msg.channel.send(commands.help.execute({permission: 0}).message);
        }
    } catch (e) {
        console.log(e);
    }

    sessionData.waiting.delete(msg.author.id);
});

bot.on('clickButton', async (button) => {
    try {
        const keyId = (button.message.embeds[0] ? button.message.embeds[0].footer.text : button.message.content).match(/id: (\d+)/);
        await button.clicker.fetch();
        const msg = button.message;
        const author = button.clicker.user;
        if (sessionData.waiting.has(author.id)) {
            await msg.channel.send("Wait please!\nI'm processing your request!");
            button.defer(true);
            return;
        }
        if (keyId !== null && keyId[1] != author.id) {
            await bot.users.cache.get(author.id).send(`Hey <@${author.id}>! Don't steal other's button!`);
            button.defer(true);
            return;
        }



        sessionData.waiting.add(author.id);

        const isDM = !(button.message.guild);
        let guildData;
        if (!isDM) {
            guildData = await util.checkGuildData(msg.guild.id);
        } else {
            guildData = null;
        }

        let playerData = await util.checkPlayerData(author.id);

        let permissionStr = !isDM&&msg.guild.members.cache.get(author.id).hasPermission("ADMINISTRATOR") ? "GuildAdmin" : "User";
        permissionStr =  userPermissions[author.id] ?? permissionStr;
        const permission = Permission[permissionStr];

        const executeData = {
            bot,
            msg,
            playerData,
            guildData,
            permission,
            isDM,
            disbut,
            id: author.id,
            time: microtime.now()/1000
        };



        let result = {};
        switch (button.id) {
            case "mine":
                result = commands.mine.execute(executeData);
                break;
            case "test2":
                result.message = "Increment: " + new D(button.message.content.split(" ").pop()).add(1).mul(2).pow(1.04).floor(0).toString();
                break;
        }

        playerData = result.playerData ?? playerData;
        fs.writeFileSync(`./saveDatas/playerData/${author.id}.json`, JSON.stringify(playerData));

        const toEdit = util.dataToMessage(result);
        if (toEdit[1]) delete toEdit[1].buttons;
        button.message.edit(...toEdit)

        sessionData.waiting.delete(author.id);
        button.defer(true);
    } catch (e) {
        console.log(e);
    }
    
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