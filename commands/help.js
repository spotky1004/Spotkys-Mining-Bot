const Command = require("../command.js");
const Permission = require("../Enums/permission.js");

function helpCommand({}) {
    return {
        message: "help message"
    }
}

module.exports = new Command({
    keyWords: ["help", "Help", "h"],
    regex: null,
    func: helpCommand,
    permissionReq: Permission.User
});