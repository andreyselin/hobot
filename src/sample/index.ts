import Telegraf from "telegraf";
import { Hobot } from "../index";
import { startController } from "./controllers/start";
import { secondController } from "./controllers/second";


// Paste your token to try basic bot functionality
const token = '[your token]';


// Running bot with specific telegraf config
const bot = new Telegraf(token);

// Running Hobot framework
export const hobot = new Hobot(bot, {
    defaultPath: '/start', // check
    commands: [ { command: 'start', path: '/start' } ],
});

// Create your first routes pointing at their controllers
// Routes are declared inside controllers
hobot.createRoute(startController);
hobot.createRoute(secondController);

// After setting up your first controller you probably want to use it
// when user takes first interaction with it (start command).

bot.launch();

// You can create other containers and navigate to them by their paths
// with hobot.gotoPath(ctx, pathString);
