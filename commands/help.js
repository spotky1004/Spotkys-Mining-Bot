const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");

function helpCommand({}) {
    return {
        message: "help message"
    }
}

module.exports = new Command({
    keyWords: ["help", "HELP", "h", "H"],
    func: helpCommand,
    permissionReq: Permission.User
});