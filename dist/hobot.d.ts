import { Telegraf } from "telegraf";
import { Controller, Ctx, HobotConfig, InternalMiddleware } from "./types";
export declare class Hobot {
    bot: Telegraf<Ctx>;
    middlewares: InternalMiddleware[];
    routes: {
        [key: string]: Controller;
    };
    constructor(bot: Telegraf<Ctx>, config: HobotConfig);
    private executeMiddleware;
    private onBeforeGet;
    private onBeforePost;
    private resolvePath;
    private processUpdate;
    gotoPath: (ctx: Ctx, path: string, data?: any) => Promise<void>;
    private createRoute;
    private canalize;
    logWithChatId(chatId: number, ...args: any[]): void;
    createPathQuery(route: string, data: Object): string;
}
//# sourceMappingURL=hobot.d.ts.map