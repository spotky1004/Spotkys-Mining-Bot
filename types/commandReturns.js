const playerData = require("./playerData.js");

const commandReturns = {
    /**
     * The user's savedata
     */
    playerData: playerData,
    /**
     * Return message
     */
    message: {
        command: new String,
        color: new String,
        image: new String,
        fields: new Array,
        footer: new String,
        description: new String,
        style: new String,
    }
};

module.exports = commandReturns;