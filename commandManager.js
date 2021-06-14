const fs = require("fs");

let toExport = {};
fs.readdirSync("./commands").forEach(file => {
    toExport[file.replace(".js", "")] = require("./commands/" + file);
});

module.exports = toExport;