const Discord = require("discord.js");
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
     * The current UNIX Time in ms
     */
    time: new Number,
    /**
     * Boolean that indicates if the message sent from the DM
     */
    isDM: new Boolean,
    /**
     * Discord id of the user
     */
    id: new String,
}

module.exports = commandParams;