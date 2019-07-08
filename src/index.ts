import { BotServer } from "./BotServer";
import { startController } from "./controllers/start";
import { IContext } from "./BotModel";


// Paste your token to try basic bot functionality
const token = '864069020:AAElEX_6ZHLzIo0BfKNjVx_7SJvzfzocDdc';

// Running bot wrapper
const botServer = new BotServer(token);


// Create your first route pointing at startContainer
botServer.createRoute(startController);

// After setting up your first container you probably want to use it
// when user takes first interaction with it (start command).

// Tell bot to work with controller under '/start' route when /start command is received
botServer.bot.start((ctx: IContext) => botServer.gotoPath(ctx, '/start'));

// Yщu can create other containers and navigate to them by their path
// with botServer.gotoPath(ctx, pathString);
