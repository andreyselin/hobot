import { IController } from "../BotModel";

// Example controller
export const startController: IController = {

    path: '/start',

    get: async ctx =>
        // You wont see this since start command only accepts updates, it doest show any initial state.
        // But if you assign this code to a new controller and navigate to it with botServer.gotoPath,
        // you will ses this line as a result of navigation
        ctx.replyWithHTML('Alright, this is default controller!'),

    post: async (ctx, updateType) =>
        ctx.replyWithHTML('You posted update')


};