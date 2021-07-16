const Discord = require("discord.js");
const disbut = require("discord-buttons");
const guildData = require("../saveDatas/Defaults/guildData.js");
const playerData = require("./playerData.js");

const commandParams = {
    /**
     * The message user sent
     */
    msg: new Discord.Message,
    /**
     * The parameter detected in the message
     */
    params: new Array,
    /**
     * The guild's savedata
     */
    guildData: guildData,
    /**
     * The user's savedata
     */
    playerData: playerData,
    /**
     * The permission level of the user
     */
    permission: new Number,
    /**
     * The client of the bot
     */
    bot: new Discord.Client,
    /**
     * The current UNIX Time in ms
     */
    time: new Number,
    /**
     * Boolean that indicates if the message sent from the DM
     */
    isDM: new Boolean,
    /**
     * "discord-buttons" library
     */
    disbut: new disbut,
    /**
     * Discord id of the user
     */
    id: new String,
}

module.exports = commandParams;