"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = __importDefault(require("telegraf/session"));
var updateTypes = {
    document: 'document',
    text: 'text',
    callback_query: 'callback_query',
    inline_query: 'inline_query',
    location: 'location',
    photo: 'photo'
};
var BotServer = /** @class */ (function () {
    function BotServer(bot, config) {
        var _this = this;
        this.routes = {};
        this.updateTypes = updateTypes;
        this.middlewares = [];
        this.bot = bot;
        this.bot.use(session_1.default());
        this.createRoute = this.createRoute.bind(this);
        this.processUpdate = this.processUpdate.bind(this);
        this.gotoPath = this.gotoPath.bind(this);
        this.canalize.call(this, config);
        Array.isArray(config && config.controllers) && config.controllers
            .forEach(function (controller) { return _this.createRoute(controller); });
        this.preCall = (config.preCall || this.preCall).bind(this);
    }
    BotServer.prototype.use = function (fn) {
        this.middlewares.push(fn);
    };
    BotServer.prototype.executeMiddleware = function (middlewares, ctx, type, next) {
        return __awaiter(this, void 0, void 0, function () {
            var composition;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, middlewares.reduceRight(function (next, fn) { return function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // collect next data
                                    return [4 /*yield*/, fn(ctx, type, next)];
                                    case 1:
                                        // collect next data
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }; }, next)];
                    case 1:
                        composition = _a.sent();
                        composition(ctx, type);
                        return [2 /*return*/];
                }
            });
        });
    };
    BotServer.prototype.preCall = function (ctx) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    BotServer.prototype.resolvePath = function (ctx, updateType) {
        if (updateType === updateTypes.callback_query) {
            if (/^g:.*/.test(ctx.callbackQuery.data)) {
                var _a = ctx.callbackQuery.data.replace(/^g:/, '').split('|', 2), path = _a[0], preData = _a[1];
                try {
                    var data = JSON.parse(preData);
                    return { path: path, data: data };
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        return { path: ctx.session.path, data: null };
    };
    BotServer.prototype.processUpdate = function (ctx, updateType) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.executeMiddleware(this.middlewares, ctx, 'post', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, path, data;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = this.resolvePath(ctx, updateType), path = _a.path, data = _a.data;
                                            return [4 /*yield*/, this.routes[path].post(ctx, updateType, data)];
                                        case 1:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.logWithChatId(ctx.chat.id, 'Error at processMessage', '\n', e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BotServer.prototype.gotoPath = function (ctx, path, data) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.executeMiddleware(this.middlewares, ctx, 'get', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.routes[path].get(ctx, data)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        this.logWithChatId(ctx.chat.id, 'Error at gotoPath:', path, '\n', e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // User is required to get his language
    // async send (user: any, message) {
    //     try {
    //         await this.bot.telegram.sendMessage(user.chatId, this.i18n.t('ru' /*user.language*/, message));
    //         return true;
    //     } catch (e) {
    //         this.log('Error when initiate sending:', e);
    //         return false;
    //     }
    // }
    BotServer.prototype.createRoute = function (controller) {
        var _this = this;
        var path = controller.path, get = controller.get, post = controller.post;
        controller.hobot = this;
        this.routes[path] = {
            path: path,
            get: function (ctx, data) { return __awaiter(_this, void 0, void 0, function () {
                var e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.preCall(ctx)];
                        case 1:
                            _a.sent();
                            this.logWithChatId(ctx.chat.id, "get:path:" + path + "/get:chat_id:" + ctx.chat.id + ", data: " + data);
                            ctx.session.path = path;
                            get.call(controller, ctx, data);
                            return [3 /*break*/, 3];
                        case 2:
                            e_3 = _a.sent();
                            console.error(e_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            post: function (ctx, updateType, data) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.preCall(ctx)];
                        case 1:
                            _a.sent();
                            this.logWithChatId(ctx.chat.id, "post:path:" + path + "/post:chat_id:" + ctx.chat.id + ", updateType: " + updateType);
                            switch (updateType) {
                                case updateTypes.document:
                                    this.logWithChatId(ctx.chat.id, ' ==> document:', ctx.update.message.document, ctx.update.message.caption || '');
                                    break;
                                case updateTypes.text:
                                    this.logWithChatId(ctx.chat.id, ' ==> message.text:', ctx.update.message.text);
                                    break;
                                case updateTypes.callback_query:
                                    this.logWithChatId(ctx.chat.id, ' ==> data:', ctx.update.callback_query.data);
                                    break;
                                default:
                                    this.logWithChatId(ctx.chat.id, ' ==> ctx.update:', ctx.update);
                                    break;
                            }
                            return [4 /*yield*/, post.call(controller, ctx, updateType, data)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        }; // To think of: Separate raw and this controller typings
        this.log('-> Path created:', path);
    };
    BotServer.prototype.canalize = function (config) {
        var _this = this;
        this.bot.start(function (ctx) { return _this.gotoPath(ctx, config.defaultPath); });
        config && config.commands && config.commands.forEach(function (command) {
            return _this.bot.command(command.command, function (ctx) { return _this.gotoPath(ctx, command.path); });
        });
        this.bot.on(updateTypes.location, function (ctx) { return _this.processUpdate(ctx, updateTypes.location); });
        this.bot.on(updateTypes.photo, function (ctx) { return _this.processUpdate(ctx, updateTypes.photo); });
        this.bot.on(updateTypes.callback_query, function (ctx) { return _this.processUpdate(ctx, updateTypes.callback_query); });
        this.bot.on(updateTypes.inline_query, function (ctx) { return _this.processUpdate(ctx, updateTypes.inline_query); });
        this.bot.on(updateTypes.text, function (ctx) { return _this.processUpdate(ctx, updateTypes.text); });
        this.bot.on(updateTypes.document, function (ctx) { return _this.processUpdate(ctx, updateTypes.document); });
    };
    // Not binded
    BotServer.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(null, __spreadArrays([new Date()], args));
    };
    // Not binded
    BotServer.prototype.logWithChatId = function (chatId) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(null, __spreadArrays([new Date(), { chatId: chatId }], args));
    };
    return BotServer;
}());
exports.BotServer = BotServer;
