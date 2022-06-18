# Hobot

Hobot is a simple route manager for Telegram built on top of Telegraf.JS.

It brings structure without reducing the flexibility of bot development.

## Installation

```sh
$ npm i -s hobot
```

## Ping-pong bot sample

Let's create an elementary bot with two controllers.
In first it will answer "PONG" if you write "PING" and navigate you to second one if you write "NEXT".
In second controller it will await for "BACK" message from you to navigate you back.

You need to just copy content of the following files.

Or you can clone final state in playground repo: https://github.com/andreyselin/hobot_sample

In both cases don't forget to paste your token in src/index.ts.

---

Entry point - `src/index.ts`:

```
import Telegraf from "telegraf";
import { Hobot } from "hobot";
import { startController } from "./controllers/start";
import { nextController } from "./controllers/next";

// Paste your token here
const token = 'YOUR_TOKEN';
const bot = new Telegraf(token);

// Wrapping bot with hobot
export const hobot = new Hobot(bot, {
    defaultPath: 'path_start',
    sessionMiddleware: session(),
    commands: [
        // Setting controller bound to '/start' path to execute on start command
        { command: 'start', path: 'path_start' }
        // You can also add other commands in this array
    ],
    // Add here controllers you want to work with:
    controllers: [
        startController,
        nextController
    ]
});

// Start telegram bot
bot.launch();
```

Now add a file with start controller to execute on start command: `src/controllers/start.ts`:

```
import { hobot } from "../index";

export const startController = {
    path: 'path_start',

    // Get function is executed when we send user
    // to path by hobot.gotoPath(ctx, 'your path', { optional parameters })
    get: async function (ctx, data) {
        return ctx.replyWithHTML('Send "PING" message to get "PONG" response or "NEXT" to go to another controller')
    },

    // This function is executed when user sends updates while being on the path
    post: async function (ctx, updateType) {
        if (updateType === hobot.updateTypes.text) {
            const text = ctx.update.message.text;
            if (text === 'PING') {
                return await ctx.replyWithHTML('PONG');
            } else if (text === 'NEXT') {
                return await hobot.gotoPath(ctx, 'path_next');
            }
        }
        await ctx.replyWithHTML('I don`t understand it, only PING please!');
    }
};
```

And finally add another controller `src/controllers/next.ts` to navigate to and back:

```
import { hobot } from "../index";

export const nextController = {
    path: 'path_next',

    get: async (ctx, data) =>
        ctx.replyWithHTML('Type "BACK" to return to start controller or press /start command:'),

    post: async (ctx, updateType) => {
        if (updateType === hobot.updateTypes.text) {
            const text = ctx.update.message.text;
            if (text === 'BACK') {
                return await hobot.gotoPath(ctx, 'path_start');
            }
        }
        await ctx.replyWithHTML('I don`t understand it, only "BACK" please!');
    }
};
```

## Running

Insert following commands to your `package.json` to run bot in terminal or daemon mode:

```
"start": "nodemon -L --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts",
"build": "rm -rf dist && tsc -p . --lib es2017 --outDir dist"
```

To run build copy this `tsconfig.json` file: https://github.com/andreyselin/hobot_sample/blob/master/tsconfig.json to the root of your project.
