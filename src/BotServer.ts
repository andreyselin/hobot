import { IController, IContext, IUpdateType } from "./BotModel";
import session from "telegraf/session";

const updateTypes: { [ key in IUpdateType ]: key } = {
    document: 'document',
    text: 'text',
    callback_query: 'callback_query',
    inline_query: 'inline_query',
    location: 'location',
    photo: 'photo'
};


export interface IHobotConfig {
    defaultPath: string;
    commands: { command: string, path: string }[];
    controllers: IController[];
    preCall?: (ctx) => Promise<any>;
}


export class BotServer {
    constructor (bot: any, config: IHobotConfig) {
        this.middlewares = [];
		this.bot = bot;
        this.bot.use(session());
        this.createRoute   = this.createRoute.bind(this);
        this.processUpdate = this.processUpdate.bind(this);
        this.gotoPath      = this.gotoPath.bind(this);
        this.canalize.call(this, config);

        Array.isArray(config && config.controllers) && config.controllers
            .forEach(controller => this.createRoute(controller));

        this.preCall = (config.preCall || this.preCall).bind(this);
    }

    use(fn) {
        this.middlewares.push(fn);
    }

    async executeMiddleware(middlewares, ctx, type, next) {
        const composition = await middlewares.reduceRight((next, fn) => async () => {
            // collect next data
            await fn(ctx, type, next)
        }, next);       
        composition(ctx, type);
    }
    async preCall (ctx) {}

    routes: { [ key: string ]: IController } = {};
    middlewares: any[];
    bot: any;
    i18n: any;

    updateTypes = updateTypes;

    resolvePath (ctx: IContext, updateType: IUpdateType) {
        if (updateType === updateTypes.callback_query) {
            if (/^g:.*/.test(ctx.callbackQuery.data)) {
                const [path, preData] = ctx.callbackQuery.data.replace(/^g:/, '').split('|', 2);
                try {
                    const data = JSON.parse(preData);
                    return { path, data }
                } catch (e) {
                    console.error(e);
                }
            }
        }
        return { path: ctx.session.path, data: null }
    }

    async processUpdate (ctx: IContext, updateType: IUpdateType) { //
        try {
			await this.executeMiddleware(this.middlewares, ctx, 'post', async (ctx, next) => {
                const { path, data } = this.resolvePath(ctx, updateType);
                await this.routes[path].post(ctx, updateType, data);
			});
        } catch (e) {
            this.logWithChatId(ctx.chat.id, 'Error at processMessage', '\n', e);
        }
    }

    async gotoPath (ctx: IContext, path: string, data?: any) {
        // Handle there is no path (got when the app has been restarted and keyboard button is pressed)
        try {
			await this.executeMiddleware(this.middlewares, ctx, 'get', async (ctx, next) => {
				await this.routes[path].get(ctx, data);
			});
        } catch (e) {
            this.logWithChatId(ctx.chat.id, 'Error at gotoPath:', path, '\n', e);
        }
    }

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

    createRoute (controller: IController) {
        const { path, get, post } = controller;
        controller.hobot = this;

        this.routes[ path ] = {
            path,
            get: async (ctx, data?: any) => {
                try {
                    await this.preCall(ctx);
                    this.logWithChatId(ctx.chat.id, `get:path:${ path }/get:chat_id:${ ctx.chat.id }, data: ${ data }`);
                    ctx.session.path = path;
                    get.call(controller, ctx, data);
                } catch (e) {
                    console.error(e);
                }
            },
            post: async (ctx, updateType: IUpdateType, data?: any) => {
                await this.preCall(ctx);
                this.logWithChatId(ctx.chat.id, `post:path:${ path }/post:chat_id:${ ctx.chat.id }, updateType: ${ updateType }`);

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

                await post.call(controller, ctx, updateType, data);
            }
        } as IController; // To think of: Separate raw and this controller typings
        this.log('-> Path created:', path);
    }

    canalize (config: IHobotConfig) {
        this.bot.start(ctx => this.gotoPath(ctx, config.defaultPath));

        config && config.commands && config.commands.forEach(command =>
            this.bot.command(command.command, (ctx) => this.gotoPath(ctx, command.path)));

        this.bot.on(updateTypes.location,      (ctx: IContext) => this.processUpdate(ctx, updateTypes.location));
        this.bot.on(updateTypes.photo,         (ctx: IContext) => this.processUpdate(ctx, updateTypes.photo));
        this.bot.on(updateTypes.callback_query,(ctx: IContext) => this.processUpdate(ctx, updateTypes.callback_query));
        this.bot.on(updateTypes.inline_query,  (ctx: IContext) => this.processUpdate(ctx, updateTypes.inline_query));
        this.bot.on(updateTypes.text,          (ctx: IContext) => this.processUpdate(ctx, updateTypes.text));
        this.bot.on(updateTypes.document,      (ctx: IContext) => this.processUpdate(ctx, updateTypes.document));
    }

    // Not binded
    log (...args){
        console.log.apply(null, [ new Date(), ...args ]);
    }

    // Not binded
    logWithChatId (chatId: number, ...args: any[]) {
        console.log.apply(null, [ new Date(), { chatId }, ...args ]);
    }

}
