import { Hobot } from "../index";
import { startController } from "./controllers/start";
import { IContext } from "../BotModel";
import { secondController } from "./controllers/second";


// Paste your token to try basic bot functionality
const token = '__YOUR_TELEGRAM_TOKEN__';

// Running bot wrapper
export const hobot = new Hobot(token);


// Create your first routes pointing at their controllers
// Routes are declared inside controllers
hobot.createRoute(startController);
hobot.createRoute(secondController);

// After setting up your first container you probably want to use it
// when user takes first interaction with it (start command).

// Tell bot to run controller under '/start' route when /start command is received
hobot.bot.start((ctx: IContext) => hobot.gotoPath(ctx, '/start'));

// Yщu can create other containers and navigate to them by their path
// with hobot.gotoPath(ctx, pathString);
