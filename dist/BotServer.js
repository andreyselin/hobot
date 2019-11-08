"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = __importDefault(require("telegraf/session"));
var telegraf_i18n_1 = __importDefault(require("telegraf-i18n"));
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
        this.routes = {};
        this.updateTypes = updateTypes;
        this.bot = bot;
        this.bot.use(session_1.default());
        if (config.i18n.use) {
            var i18n = new telegraf_i18n_1.default({
                useSession: true,
                defaultLanguage: config.i18n.default,
                directory: config.i18n.path
            });
            this.bot.use(i18n.middleware());
        }
        this.createRoute = this.createRoute.bind(this);
        this.processUpdate = this.processUpdate.bind(this);
        this.gotoPath = this.gotoPath.bind(this);
        this.canalize.call(this);
        this.bot.launch();
    }
    BotServer.prototype.processUpdate = function (ctx, updateType) {
        try {
            if (!ctx.session.path) {
                ctx.session.path = '/start';
            }
            this.routes[ctx.session.path].post(ctx, updateType);
        }
        catch (e) {
            console.log('Error at processMessage', '\n', e);
        }
    };
    BotServer.prototype.gotoPath = function (ctx, path, data) {
        // Handle there is no path (got when the app has been restarted and keyboard button is pressed)
        try {
            this.routes[path].get(ctx, data);
        }
        catch (e) {
            console.log('Error at gotoPath:', path, '\n', e);
        }
    };
    // User is required to get his language
    // async send (user: any, message) {
    //     try {
    //         await this.bot.telegram.sendMessage(user.chatId, this.i18n.t('ru' /*user.language*/, message));
    //         return true;
    //     } catch (e) {
    //         console.log('Error when initiate sending:', e);
    //         return false;
    //     }
    // }
    BotServer.prototype.createRoute = function (_a) {
        var _this = this;
        var path = _a.path, get = _a.get, post = _a.post;
        this.routes[path] = {
            path: path,
            get: function (ctx, data) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log('get:', path, data);
                    ctx.session.path = path;
                    // ctx.i18n.locale('ru');
                    get(ctx, data);
                    return [2 /*return*/];
                });
            }); },
            post: function (ctx, updateType) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log('post:', path, updateType);
                    post(ctx, updateType);
                    return [2 /*return*/];
                });
            }); }
        };
        console.log('-> Path created:', path);
    };
    BotServer.prototype.canalize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.bot.on(updateTypes.location, function (ctx) { return _this.processUpdate(ctx, updateTypes.location); });
                this.bot.on(updateTypes.photo, function (ctx) { return _this.processUpdate(ctx, updateTypes.photo); });
                this.bot.on(updateTypes.callback_query, function (ctx) { return _this.processUpdate(ctx, updateTypes.callback_query); });
                this.bot.on(updateTypes.inline_query, function (ctx) { return _this.processUpdate(ctx, updateTypes.inline_query); });
                this.bot.on(updateTypes.text, function (ctx) { return _this.processUpdate(ctx, updateTypes.text); });
                this.bot.on(updateTypes.document, function (ctx) { return _this.processUpdate(ctx, updateTypes.document); });
                return [2 /*return*/];
            });
        });
    };
    return BotServer;
}());
exports.BotServer = BotServer;
