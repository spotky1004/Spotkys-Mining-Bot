const fs = require("fs");
const Discord = require("discord.js");
const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const util = require("../util.js");

const imageList = require("../data/imageList.js");

function evalCommand({msg, params, playerData, guildData, permission, isDM, time}) {
    let input = params[1];
    let output;
    try {
        output = eval(input);
        // output fix
        if (typeof output === "object" && !Array.isArray(output)) {
            output = JSON.parse(JSON.stringify(output));
            for (const key in output) {
                if (Array.isArray(output[key]) && output[key].length > 15) {
                    const l = output[key].length;
                    output[key] = output[key].slice(0, 15).concat([`(+ ${l-15})`]);
                }
            }
            output = JSON.stringify(output,null,'\t');
        } else if (typeof output === "string") {
            output = `"${output}"`;
        } else if (typeof output === "undefined") {
            output = "undefined";
        }
        // saveData fix
        if (input.includes("pathAllSave")) playerData = util.checkPlayerData(msg.author.id);
    } catch (e) {
        output = e;
    }

    output = output.toString();

    return {
        playerData: playerData,
        message: {
            command: "Eval",
            color: "#000000",
            image: imageList.auto,
            fields: [
                {
                    name: "Input",
                    value: "```js\n" + input.substr(0, 1000) + "\n```"
                },
                {
                    name: "Output",
                    value: "```js\n" + output.substr(0, 1000) + "\n```"
                }
            ],
            description: "eval"
        }
    }
}

module.exports = new Command({
    keyWords: ["eval"],
    regex: /^((?:```js)?\n?((.|\n)+?)\n?(?:```))/,
    func: evalCommand,
    permissionReq: Permission.Admin
});