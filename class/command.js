const Command = class {
    constructor({keyWords, regex, func, permissionReq, canAcceptEmpty}) {
        this.keyWords = keyWords;
        this.regex = regex;
        this.func = func;
        this.permissionReq = permissionReq;
        this.canAcceptEmpty = canAcceptEmpty ?? false;
    }
    keyWords = new Array();
    regex = new RegExp();
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
            this.regex !== null &&
            rawParameter.length === 0 &&
            !this.canAcceptEmpty
        ) return {message: "`Missing Parameter(s)!`"};

        const content = rawParameter;
        let params;
        if (this.regex !== null) {
            if (content.match(this.regex) === null && this.canAcceptEmpty) return {message: "`Wrong Parameter(s)!`"};
            params = (content.match(this.regex) ?? []).slice(1);
        }
        
        return this.func({msg, params, guildData, playerData, permission, bot, time, isDM, disbut, id});
    }
}

module.exports = Command;