const Command = require("../command.js");
const Permission = require("../Enums/permissionEnum.js");

function helpCommand({}) {
    return {
        message: "help message"
    }
}

module.exports = new Command({
    keyWords: ["help"],
    regex: null,
    func: helpCommand,
    permissionReq: Permission.User
});