const D = require("decimal.js");

const shopItems = [
    {
        keyWords: ["pic", "pick", "pickaxe", "p", "P"],
        cost: (level) => {
            // 000, Math.floor(5*((lv-1)**1.5+1))
            // 010, Math.floor(10*((lv-1)**1.7+1))
            // 030, Math.floor(20*((lv-1)**1.9+1))
            // 060, Math.floor(40*((lv-1)**(2.1+(lv-60)*0.02)+1))
            // 100, Math.floor(80*((lv-1)**(2.9+(lv-100)*0.04)+1))
            // 150, Math.floor(160*((lv-1)**(3.5+(lv-150)*(0.083+(lv-150)*0.0015))+1))

            let cost;

            if      (level <=  10) cost = new D(  5).mul(new D(1).add(new D(level-1).pow(1.5))).floor();
            else if (level <=  30) cost = new D( 10).mul(new D(1).add(new D(level-1).pow(1.7))).floor();
            else if (level <=  60) cost = new D( 20).mul(new D(1).add(new D(level-1).pow(1.9))).floor();
            else if (level <= 100) cost = new D( 40).mul(new D(1).add(new D(level-1).pow(2.1+0.02*(level-60)))).floor();
            else if (level <= 150) cost = new D( 80).mul(new D(1).add(new D(level-1).pow(2.9+0.04*(level-100)))).floor();
            else if (level <= 250) cost = new D(160).mul(new D(1).add(new D(level-1).pow(3.5+(level-150)*(0.083+(level-150)*0.0015)+1))).floor();
            else                   cost = new D(Infinity);

            return cost;
        }
    }
];

module.exports = shopItems;