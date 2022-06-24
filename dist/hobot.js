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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hobot = void 0;
const types_1 = require("./types");
class Hobot {
    constructor(bot, config) {
        this.processUpdate = (updateType) => (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.executeMiddleware(this.middlewares, ctx, "post", (ctx) => __awaiter(this, void 0, void 0, function* () {
                    const { path, data } = this.resolvePath(ctx, updateType);
                    yield this.routes[path].post({
                        ctx,
                        updateType,
                        hobot: this,
                        data,
                    });
                }));
            }
            catch (e) {
                this.logWithChatId(ctx.chat.id, "Error at processMessage", "\n", e);
            }
        });
        this.gotoPath = (ctx, path, data) => __awaiter(this, void 0, void 0, function* () {
            // Handle there is no path (got when the app has been restarted and keyboard button is pressed)
            try {
                yield this.executeMiddleware(this.middlewares, ctx, "get", (ctx) => __awaiter(this, void 0, void 0, function* () {
                    yield this.routes[path].get({ ctx, hobot: this, data });
                }));
            }
            catch (e) {
                this.logWithChatId(ctx.chat.id, "Error at gotoPath:", path, "\n", e);
            }
        });
        this.createRoute = (controller) => {
            this.routes[controller.path] = {
                path: controller.path,
                get: ({ ctx, data }) => __awaiter(this, void 0, void 0, function* () {
                    yield this.onBeforeGet(ctx);
                    ctx.session.path = controller.path;
                    controller.get({ ctx, hobot: this, data });
                }),
                post: ({ ctx, updateType, data }) => __awaiter(this, void 0, void 0, function* () {
                    yield this.onBeforePost(ctx);
                    ctx.session.path = controller.path;
                    controller.post({ ctx, updateType, hobot: this, data });
                }),
            };
        };
        this.canalize = (config) => {
            this.bot.start((ctx) => this.gotoPath(ctx, config.defaultPath));
            config.commands.forEach(({ command, path }) => this.bot.command(command, (ctx) => this.gotoPath(ctx, path)));
            this.bot.on(types_1.UpdateType.LOCATION, this.processUpdate(types_1.UpdateType.LOCATION));
            this.bot.on(types_1.UpdateType.PHOTO, this.processUpdate(types_1.UpdateType.PHOTO));
            this.bot.on(types_1.UpdateType.CALLBACK_QUERY, this.processUpdate(types_1.UpdateType.CALLBACK_QUERY));
            this.bot.on(types_1.UpdateType.INLINE_QUERY, this.processUpdate(types_1.UpdateType.INLINE_QUERY));
            this.bot.on(types_1.UpdateType.TEXT, this.processUpdate(types_1.UpdateType.TEXT));
            this.bot.on(types_1.UpdateType.DOCUMENT, this.processUpdate(types_1.UpdateType.DOCUMENT));
        };
        this.bot = bot;
        this.middlewares = config.middlewares || [];
        this.routes = {};
        this.bot.use((ctx, next) => {
            ctx.session = { path: "" };
            return next();
        });
        this.bot.use(config.sessionMiddleware);
        this.canalize(config);
        config.controllers.forEach(this.createRoute);
        this.onBeforeGet = (config.onBeforeGet || this.onBeforeGet).bind(this);
        this.onBeforePost = (config.onBeforePost || this.onBeforePost).bind(this);
    }
    executeMiddleware(middlewares, ctx, type, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const composition = middlewares.reduceRight((next, fn) => () => __awaiter(this, void 0, void 0, function* () {
                yield fn(ctx, type, next);
            }), next);
            yield composition(ctx, type, () => __awaiter(this, void 0, void 0, function* () { }));
        });
    }
    onBeforeGet(ctx) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onBeforePost(ctx) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    resolvePath(ctx, updateType) {
        if (updateType === types_1.UpdateType.CALLBACK_QUERY) {
            if (/^g:.*/.test(ctx.callbackQuery.data)) {
                const [path, preData] = ctx.callbackQuery.data
                    .replace(/^g:/, "")
                    .split("|", 2);
                try {
                    const data = JSON.parse(preData);
                    return { path, data };
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        return { path: ctx.session.path, data: null };
    }
    logWithChatId(chatId, ...args) {
        console.log.apply(null, [new Date(), { chatId }, ...args]);
    }
    createPathQuery(route, data) {
        const res = `g:${route}|${JSON.stringify(data)}`;
        return res.length > 60 ? null : res;
    }
}
exports.Hobot = Hobot;
//# sourceMappingURL=hobot.js.map