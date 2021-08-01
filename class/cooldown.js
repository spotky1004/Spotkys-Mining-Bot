const microtime = require("microtime");
const util = require("../util");

class Cooldown {
  constructor(cooldown) {
    this.cooldown = cooldown;
  }
  cooldown = new Number;

  timeLeft(time) {
    return this.cooldown - (microtime.now()/1000-time);
  }

  isDone(time) {
    return this.timeLeft(time) <= 0;
  }

  format(time) {
    let output = "";
    output += `\`${util.timeNotation(this.timeLeft(time), this.cooldown)} / ${util.timeNotation(this.cooldown)}\``;
    if (this.cooldown > 60_000) output += `\n<t:${Math.floor((time+this.cooldown)/1000)}>`;
    return output;
  }
}

module.exports = Cooldown;