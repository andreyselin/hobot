# Hobot

Hobot is a simple route manager for Telegram. It will help you manage the state of the your bot

## Installation

Install the dependencies and devDependencies and start the server.

```sh
$ cd hobot
$ npm install
$ npm run sample
```

## Ping-pong sample

Let's create an elementary bot with one controller that answers PONG if you write PING

Entry point - `index.ts`:
```
import Telegraf from "telegraf";
import { Hobot } from "../index";
import { startController } from "./controllers/start";

const token = '[your token]';
const bot = new Telegraf(token);

export const hobot = new Hobot(bot, {
    defaultPath: '/start', // check
    commands: [ { command: 'start', path: '/start' } ],
});
hobot.createRoute(startController);
bot.launch();
```

And controller - `controllers/start.ts`:
```
import { IController } from "../../BotModel";
import { hobot } from "../index";

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
```
