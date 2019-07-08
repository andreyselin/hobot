import { IController, IContext, IUpdateType } from "./BotModel";
import Telegraf from "telegraf";
import session from "telegraf/session";
import TelegrafI18n from "telegraf-i18n";


const updateTypes: { [ key in IUpdateType ]: key } = {
    document: 'document',
    text: 'text',
    callback_query: 'callback_query',
    inline_query: 'inline_query',
    location: 'location',
    photo: 'photo'
};

export class BotServer {
    constructor (token) {
        this.createRoute   = this.createRoute.bind(this);
        this.processUpdate = this.processUpdate.bind(this);
        this.gotoPath      = this.gotoPath.bind(this);
        this.canalize.bind(this)(token);
    }

    routes: { [key: string]: IController } = {};
    bot: any;
    i18n: any;

    processUpdate (ctx: IContext, updateType: IUpdateType) {
        try {
            if (!ctx.session.path) {
                ctx.session.path = '/start';
            }
            this.routes[ctx.session.path].post(ctx, updateType);
        } catch (e) {
            console.log('Error at processMessage', '\n', e);
        }
    }

    gotoPath (ctx: IContext, path: string, data?: any) {
        // Handle there is no path (got when the app has been restarted and keyboard button is pressed)

        try {
            this.routes[path].get(ctx, data);
        } catch (e) {
            console.log('Error at gotoPath:', path, '\n', e);
        }
    }

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

    createRoute ({ path, get, post }: IController) {
        this.routes[path] = {
            path,
            get: async (ctx, data?: any) => {
                console.log('get:', path, data);
                ctx.session.path = path;
                ctx.i18n.locale('ru');
                get(ctx, data);
            },
            post: async (ctx, updateType: IUpdateType) => {
                console.log('post:', path, updateType);
                post(ctx, updateType);
            }
        };
        console.log('path created:', path);
    }

    async canalize (token) {

        this.bot = new Telegraf(token);
        this.bot.use(session());

        this.i18n = new TelegrafI18n({
            useSession: true,
            defaultLanguage: 'en',
            directory: __dirname+'/locales'
        });
        this.bot.use(this.i18n.middleware());

        // /Move

        this.bot.on(updateTypes.location,      (ctx: IContext) => this.processUpdate(ctx, updateTypes.location));
        this.bot.on(updateTypes.photo,         (ctx: IContext) => this.processUpdate(ctx, updateTypes.photo));
        this.bot.on(updateTypes.callback_query,(ctx: IContext) => this.processUpdate(ctx, updateTypes.callback_query));
        this.bot.on(updateTypes.inline_query,  (ctx: IContext) => this.processUpdate(ctx, updateTypes.inline_query));
        this.bot.on(updateTypes.text,          (ctx: IContext) => this.processUpdate(ctx, updateTypes.text));
        this.bot.on(updateTypes.document,      (ctx: IContext) => this.processUpdate(ctx, updateTypes.document));

        this.bot.launch();
        console.log('123');
    }

}
