const Command = class {
    constructor({keyWords, regex, func, permissionReq}) {
        this.keyWords = keyWords;
        this.regex = regex;
        this.func = func;
        this.permissionReq = permissionReq;
    }

    keyWords = new Array();
    regex = new RegExp();
    func = new Function();
    permissionReq = new Number();

    execute({msg, rawParameter, guildData, permission}) {
        if (this.permissionReq > permission) return {message: "`Missing permission!`"};
        if (
            this.regex !== null &&
            rawParameter.length === 0
        ) return {message: "`Missing Parameters!`"};

        const content = rawParameter;
        let params;
        if (this.regex !== null) {
            if (content.match(this.regex).length === 0) return;
            params = content.match(this.regex).slice(1);
        }
        
        return this.func({msg, params, guildData, permission});
    }
}

module.exports = Command;