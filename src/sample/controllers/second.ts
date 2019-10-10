import { IController } from "../../BotModel";
import { hobot } from "../index";

// Example controller
export const secondController: IController = {

    path: '/second',

    get: async ctx =>
        ctx.replyWithHTML('Alright, this is second controller!'),

    post: async (ctx, updateType) => {
        await ctx.replyWithHTML('You posted this type of update: ' + updateType);
        if (updateType === hobot.updateTypes.text) {
            const { text } = ctx.update.message;
            await ctx.replyWithHTML('You posted text:\n' + text);
        }

    }


};