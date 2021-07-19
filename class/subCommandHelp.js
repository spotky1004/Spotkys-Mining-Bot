const util = require("../util.js");

class SubCommandHelp {
    constructor(commandSections) {
        this.commandSections = commandSections;
    }
    commandSections = new Array;

    makeField(playerData, guildData) {
        let fields = [];

        for (let i = 0; i < this.commandSections.length; i++) {
            let sectionFields = [];

            const section = this.commandSections[i];
            const sectionData = section.data;

            sectionFields.push({
                name: `${util.strs.spot} _${section.title}_ ${util.strs.spot}`,
                value: "** **",
                inline: false
            });
        
            for (let j = 0; j < sectionData.length; j++) {
                const command = sectionData[j];
                if (typeof command.unlocked === "undefined" || command.unlocked(playerData)) {
                    sectionFields.push({
                        name: `\`${guildData.prefix}${command.cmd}\``,
                        value: `_${command.msg}_`,
                        inline: command.inline ?? true
                    });
                } else {
                    sectionFields.push({
                        name: "🔒",
                        value: `_Reach ${command.unlockMessage} to unlock command_`,
                        inline: command.inline ?? true
                    });
                }
            }
        
            let dupeCheckArr = new Set();
            sectionFields = sectionFields.filter(e => {
                if (!dupeCheckArr.has(e.value)) {
                    dupeCheckArr.add(e.value);
                    return true;
                } else {
                    return false;
                }
            });

            fields.push(...sectionFields);
        }
        return fields;
    }
}

module.exports = SubCommandHelp;