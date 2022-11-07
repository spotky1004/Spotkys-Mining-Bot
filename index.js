// import modules
const Discord = require("discord.js");
const bot = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'], shardCount: 1});
const fs = require("fs");
const microtime = require('microtime');
const Decimal = require("decimal.js");



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



bot.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    // if (sessionData.waiting.has(msg.author.id)) {
        // await msg.channel.send("Wait please!\nI'm processing your request!");
        // return;
    // }
    sessionData.waiting.add(msg.author.id);

    try {
        const commandParams = util.commandParams({bot, msg});

        // init
        if (msg.content.startsWith(commandParams.prefix)) {
            let playerData = commandParams.playerData;
            let guildData = commandParams.guildData;

            // execute command
            if (commandKeyWords.includes(commandParams.keyWord)) {
                const commandToExecute = commands[commandDict.get(commandParams.keyWord)];
                const result = await commandToExecute.execute(commandParams);

                const time = commandParams.time;

                playerData = result.playerData ?? playerData;
                playerData.id = msg.author.id;
                playerData.name = msg.author.username;
                fs.writeFileSync(`./saveDatas/playerData/${msg.author.id}.json`, JSON.stringify(playerData));

                if (!commandParams.isDM) {
                    guildData.commandCounter++;
                    guildData.commandCounterToday.push(Math.floor(time/1000));
                    guildData.commandCounterToday = guildData.commandCounterToday.filter(e => e > time/1000-86400);
                    guildData.users.push(msg.author.id);
                    guildData.users = [...new Set(guildData.users)];
                    guildData.usersToday[msg.author.id] = Math.floor(time/1000);
                    for (const id in guildData.usersToday) if (guildData.usersToday[id] < time/1000-86400) delete guildData.usersToday[id];
                    fs.writeFileSync(`./saveDatas/guildData/${msg.guild.id}.json`, JSON.stringify(guildData));
                }
                
                msg.channel.send(util.dataToMessage({data: result, playerData}));
            }
        } else if (msg.content.match(/<@&?!?763833293044711436>/) || msg.content.match(/<@&?!?763830703141945404>/)) {
            let guildData = {prefix: "+"};
            let playerData = await util.checkPlayerData(msg.author.id);
            await msg.channel.send(
                util.dataToMessage({
                    data: commands.help.execute({permission: 0, guildData, playerData}),
                    playerData
                })
            );
        }
    } catch (e) {
        console.log(e);
    }

    sessionData.waiting.delete(msg.author.id);
});



bot.on("interactionCreate", async (interaction) => {
    const msg = interaction.message;

    const interactionAuthorId = interaction.user.id;
    const messageAuthorId = ((msg.embeds[0] ? msg.embeds[0].footer.text : msg.content).match(/id: (\d+)/) ?? [])[1];

    if (interactionAuthorId !== messageAuthorId) {
        interaction.reply({
            content: "Hey! Don't steal other's button!",
            ephemeral: true
        });
        return;
    }



    const commandParams = util.commandParams({bot, msg: {
        author: interaction.user,
        guild: interaction.guild
    }});

    let result;
    switch (interaction.customId) {
        case "mineCommand":
            result = commands.mine.execute(commandParams);
            break;
    }

    if (result) {
        await msg.edit(util.dataToMessage({data: result, playerData: commandParams.playerData}));
        fs.writeFileSync(`./saveDatas/playerData/${interactionAuthorId}.json`, JSON.stringify(result.playerData));
    }


    interaction.deferUpdate()
        .catch(err => console.error(err));
})



bot.on("ready", async () => {
    // await bot.channels.fetch("853899169014087680").then(ch => ch.send("`Successfully Logged!`"));
    console.log("login!");

    bot.user.setPresence({
        status: 'online',
        activities: [{
            name: "Ping me to open help!",
            type: 'WATCHING',
        }]
    });
});

bot.login(config.token);