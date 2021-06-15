const Command = require("../command.js");
const Permission = require("../Enums/permission.js");

function testCommand({params}) {
    return {
        message: params[0]
    }
}

module.exports = new Command({
    keyWords: ["test", "t"],
    regex: /^(.+)/,
    func: testCommand,
    permissionReq: Permission.User
});