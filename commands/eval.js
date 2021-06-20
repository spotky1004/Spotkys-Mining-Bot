const fs = require("fs");
const Discord = require("discord.js");
const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const util = require("../util.js");

function evalCommand({msg, params, playerData, guildData, permission}) {
    let input = params[1];
    let output;
    try {
        output = eval(input);
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
    } catch (e) {
        output = e;
    }

    output = output.toString();

    return {
        message: {
            command: "Eval",
            color: "#000000",
            image: "https://i.imgur.com/ihsB9OK.png",
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