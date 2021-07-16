const Command = require("../class/command.js");
const Permission = require("../enums/permission.js");

const [commandParams, commandReturns] = [require("../types/commandParam.js"), require("../types/commandReturns.js")];
/**
 * @param {commandParams}
 * @returns {commandReturns} 
 */
function test2Command({msg, disbut}) {
    let button = new disbut.MessageButton()
        .setStyle("green")
        .setLabel("Increment!")
        .setID("test2");
    
    return {
        message: "Increment: 0",
        addition: {
            buttons: [button]
        }
    }   
}

module.exports = new Command({
    keyWords: ["test2"],
    func: test2Command,
    permissionReq: Permission.User
});