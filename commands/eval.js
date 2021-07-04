const fs = require("fs");
const Discord = require("discord.js");
const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const colorSet = require("../data/colorSet.js");
const util = require("../util.js");

const imageList = require("../data/imageList.js");

async function evalCommand({bot, msg, params, playerData, guildData, permission, isDM, time}) {
    let input = params[1];
    let output = "";
    tryStatment: try {
        output = await eval(input);
        if (output && output.message) break tryStatment;
        // output fix
        output = ouputTypeFixer(output);
        // saveData fix
        if (input.includes("pathAllSave")) playerData = util.checkPlayerData(msg.author.id);
        
        output = output.toString();
    } catch (e) {
        output = e;
        output = output.toString();
    }

    return {
        playerData: playerData,
        message: output.message ?? {
            command: "Eval",
            color: colorSet.Black,
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
            footer: "eval"
        }
    }
}

function ouputTypeFixer(output) {
    if (Array.isArray(output)) {
        output = `[ ${output.map(ouputTypeFixer)} ]`
    } else if (typeof output === "object") {
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
    return output;
}

module.exports = new Command({
    keyWords: ["eval"],
    paramRegex: [/^```js/, /((?:[^`]|\n|``[^`]|`[^`])+)/, /```/],
    paramIgnore: [true, false, true],
    func: evalCommand,
    permissionReq: Permission.Admin
});