const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");

function helpCommand({}) {
    return {
        message: "help message"
    }
}

module.exports = new Command({
    keyWords: ["help", "HELP", "h", "H"],
    regex: null,
    func: helpCommand,
    permissionReq: Permission.User
});