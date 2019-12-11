"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackQueryCreator = function (route, data) {
    var res = 'global:' + route + '|' + JSON.stringify(data);
    if (res.length > 60) {
        throw new Error('Too much data');
    }
    return res;
};
