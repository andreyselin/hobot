import { IController } from "../../BotModel";
import { hobot } from "../index";

// Example controller
export const startController: IController = {

    path: '/start',

    get: async ctx =>
        ctx.replyWithHTML('Write PING'),

    post: async (ctx, updateType) => {
		if (updateType === hobot.updateTypes.text && ctx.update.message.text === 'PING') {
			return await ctx.replyWithHTML('PONG');
		}
		await ctx.replyWithHTML('i don`t understand it, only PING');
    }


};