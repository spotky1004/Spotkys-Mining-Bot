const fs = require("fs");
const Discord = require("discord.js");
const D = require("decimal.js");

const Command = require("../class/command.js");
const Permission = require("../Enums/permission.js");
const util = require("../util.js");

const artifactEnum = require("../enums/artifact.js");
const artifactSet  = util.enumToSets(artifactEnum);

const imageList = require("../data/imageList.js");

const randomDescriptions = [
    "exchange your artifact coin for an articaft!",
    "artifact coin is too expensive!",
    "they aren't easy to get",
    "they have mystical power",
];

function artifactCommand({playerData, params}) {
    const [tab, upgrade] = params;
    
    return {
        message: tab + " " + upgrade
    }
}

module.exports = new Command({
    keyWords: ["artifact", "ARTIFACT", "arti", "art", "a", "A", "ㅁ"],
    regex: /^([1-9]|coin|buy|refund|c|b|r)?((?: )(?:coin|gem|c|g|))?/,
    canAcceptEmpty: true,
    func: artifactCommand,
    permissionReq: Permission.User
});