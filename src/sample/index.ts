import { Hobot } from "../index";
import { startController } from "./controllers/start";
import { IContext } from "../BotModel";
import { secondController } from "./controllers/second";
import Telegraf from "telegraf";


// Paste your token to try basic bot functionality
const token = '864069020:AAEpCAnO-8sQp3sWA84CkopofdvYOM5Z2EY';


// Running bot with specific telegraf config
const bot = new Telegraf(token /* , { Your telegraf config }*/);


// Running Hobot framework
export const hobot = new Hobot(bot, {
    i18n: {
        use: false,
        default: 'en',
        // Make sure this directory exists:
        path: __dirname + '/locales'
    }
});

// Create your first routes pointing at their controllers
// Routes are declared inside controllers
hobot.createRoute(startController);
hobot.createRoute(secondController);

// After setting up your first controller you probably want to use it
// when user takes first interaction with it (start command).

// Tell bot to run controller under '/start' route when /start command is received
hobot.bot.start((ctx: IContext) => hobot.gotoPath(ctx, '/start'));


// You can create other containers and navigate to them by their paths
// with hobot.gotoPath(ctx, pathString);
