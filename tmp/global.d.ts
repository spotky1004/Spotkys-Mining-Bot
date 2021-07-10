/**
 * 🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔
 */

import Decimal from "decimal.js";
import playerData from "../saveDatas/Defaults/playerData.js"

//declare var testVariable: object;
//declare var playerData: object = playerData;
declare namespace playerData {
    /**
     * amount of coin
     */
    let coin: Decimal;
}