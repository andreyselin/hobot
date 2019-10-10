import { IController } from "../../BotModel";
import { hobot } from "../index";

// Example controller
export const startController: IController = {

    path: '/start',

    get: async ctx =>
        // You wont see this since start command only accepts updates, it doest show any initial state.
        // But if you assign this code to a new controller and navigate to it with botServer.gotoPath,
        // you will see this line as a result of navigation
        ctx.replyWithHTML('Alright, this is start controller!'),

    post: async (ctx, updateType) => {

        await ctx.replyWithHTML('This is triggered when you pressed start button or entered /start command');
        hobot.gotoPath(ctx, '/second', { passedProperty: 'passedProperty' });

    }


};