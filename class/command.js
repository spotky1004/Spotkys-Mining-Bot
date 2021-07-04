class Command {
    constructor({keyWords, paramRegex, paramIgnore, func, permissionReq, canAcceptEmpty}) {
        this.keyWords = keyWords;
        this.paramRegex = paramRegex ?? [];
        this.paramIgnore = paramIgnore ?? Array(this.paramRegex).fill(false);
        this.func = func;
        this.permissionReq = permissionReq;
    }
    keyWords = new Array();
    paramRegex = new Array();
    paramIgnore = new Array();
    func = new Function();
    permissionReq = new Number();
    canAcceptEmpty = new Boolean();

    execute({
        // message
        msg, rawParameter,
        // saveData
        guildData, playerData,
        // data
        permission, bot, isDM, id,
        // constant
        time,
        // lib
        disbut
    }) {
        if (this.permissionReq > permission) return {message: "`Missing permission!`"};
        if (
            this.paramRegex !== null &&
            rawParameter.length === 0 &&
            !this.canAcceptEmpty
        ) return {message: "`Missing Parameter(s)!`"};

        let content = rawParameter;
        let params = [];
        for (let i = 0, l = this.paramRegex.length; i < l; i++) {
            /** @type {String|undefined} */
            const match = (content.match(this.paramRegex[i]) ?? [])[0];
            if (typeof match === "undefined" && this.paramIgnore[i]) break;

            params.push(match);
            content = content.substr((match ?? "").length).trim();
        }
        
        return this.func({msg, params, guildData, playerData, permission, bot, time, isDM, disbut, id});
    }
}

module.exports = Command;