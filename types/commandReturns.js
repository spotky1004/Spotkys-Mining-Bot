const embedFormer = require("./embedFormer.js");
const playerData = require("./playerData.js");

const commandReturns = {
    /**
     * The user's savedata
     */
    playerData: playerData,
    /**
     * Return message
     */
    message: embedFormer,
    /**
     * components
     */
    components: [
        [
            {
                type: new String,
                custom_id: new String,
                label: new String,
                style: new String
            }
        ]
    ]
};

module.exports = commandReturns;