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
    return `\`${util.timeNotation(this.timeLeft(time), this.cooldown)} / ${util.timeNotation(this.cooldown)}\``
  }
}

module.exports = Cooldown;