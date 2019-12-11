import { BotServer } from "./BotServer";

export interface IController {
    path: string;
    get: (ctx: IContext, data?: any) => Promise<any>;
    post: (ctx: IContext, updateType: IUpdateType, data?: any) => Promise<any>;
    hobot: BotServer;
}

export type IContext = any;

// Make this IContext one day
export interface IContextTmp {
    session: {
        path: string

        // put our optional props stored
        // you want to store in session

    },
    i18n: {
        locale(languageCode: string): void
    }
    replyWithHTML(): void
}

// Telegraf or telegram binded values.
// These values are strict. Do not change them:
export type IUpdateType = 'document' | 'text' | 'callback_query' | 'inline_query' | 'location' | 'photo';
