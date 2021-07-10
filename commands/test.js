const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");

function testCommand({params}) {
    return {
        message: params[0]
    }
}

module.exports = new Command({
    keyWords: ["test", "t"],
    paramRegex: [/^.+/],
    func: testCommand,
    permissionReq: Permission.Admin
});