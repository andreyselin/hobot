import { BotServer } from "./BotServer";
import { startController } from "./controllers/start";
import { IContext } from "./BotModel";


// Paste your token to try basic bot functionality
const token = '_____USE YOUR TOKEN HERE_____';

const botServer = new BotServer(token);
botServer.createRoute(startController);

// Tell bot to work with controller under '/start'
// route when /start command is passed
botServer.bot.start((ctx: IContext) => botServer.gotoPath(ctx, '/start'));