import { Telegraf } from "telegraf";
import {
  Controller,
  Ctx,
  HobotConfig,
  InternalMiddleware,
  UpdateType,
} from "./types";

export class Hobot {
  bot: Telegraf<Ctx>;
  middlewares: InternalMiddleware[];
  routes: { [key: string]: Controller };

  public constructor(bot: Telegraf<Ctx>, config: HobotConfig) {
    this.bot = bot;
    this.middlewares = config.middlewares || [];
    this.routes = {};

    this.bot.use((ctx, next) => {
      ctx.session = { path: "" };
      return next();
    });

    this.bot.use(config.sessionMiddleware);

    this.canalize(config);

    config.controllers.forEach(this.createRoute);

    this.onBeforeGet = (config.onBeforeGet || this.onBeforeGet).bind(this);
    this.onBeforePost = (config.onBeforePost || this.onBeforePost).bind(this);
  }

  private async executeMiddleware(
    middlewares: InternalMiddleware[],
    ctx: Ctx,
    type: string,
    next: InternalMiddleware
  ) {
    const composition = middlewares.reduceRight(
      (next, fn) => async () => {
        await fn(ctx, type, next);
      },
      next
    );

    await composition(ctx, type, async () => {});
  }

  private async onBeforeGet(ctx: Ctx) {}
  private async onBeforePost(ctx: Ctx) {}

  private resolvePath(ctx: Ctx, updateType: UpdateType) {
    if (updateType === UpdateType.CALLBACK_QUERY) {
      if (/^g:.*/.test(ctx.callbackQuery.data)) {
        const [path, preData] = ctx.callbackQuery.data
          .replace(/^g:/, "")
          .split("|", 2);

        try {
          const data = JSON.parse(preData);
          return { path, data };
        } catch (e) {
          console.error(e);
        }
      }
    }

    return { path: ctx.session.path, data: null };
  }

  private processUpdate = (updateType: UpdateType) => async (ctx: Ctx) => {
    try {
      await this.executeMiddleware(
        this.middlewares,
        ctx,
        "post",
        async (ctx) => {
          const { path, data } = this.resolvePath(ctx, updateType);
          await this.routes[path].post({
            ctx,
            updateType,
            hobot: this,
            data,
          });
        }
      );
    } catch (e) {
      this.logWithChatId(ctx.chat.id, "Error at processMessage", "\n", e);
    }
  };

  public gotoPath = async (ctx: Ctx, path: string, data?: any) => {
    // Handle there is no path (got when the app has been restarted and keyboard button is pressed)
    try {
      await this.executeMiddleware(
        this.middlewares,
        ctx,
        "get",
        async (ctx) => {
          await this.routes[path].get({ ctx, hobot: this, data });
        }
      );
    } catch (e) {
      this.logWithChatId(ctx.chat.id, "Error at gotoPath:", path, "\n", e);
    }
  };

  private createRoute = (controller: Controller) => {
    this.routes[controller.path] = {
      path: controller.path,
      get: async ({ ctx, data }) => {
        try {
          await this.onBeforeGet(ctx);
          ctx.session.path = controller.path;
          controller.get({ ctx, hobot: this, data });
        } catch (e) {
          console.error(e);
        }
      },
      post: async ({ ctx, updateType, data }) => {
        await this.onBeforePost(ctx);
        await controller.post({ ctx, updateType, hobot: this, data });
      },
    };
  };

  private canalize = (config: HobotConfig) => {
    this.bot.start((ctx) => this.gotoPath(ctx, config.defaultPath));

    config.commands.forEach(({ command, path }) =>
      this.bot.command(command, (ctx) => this.gotoPath(ctx, path))
    );

    this.bot.on(UpdateType.LOCATION, this.processUpdate(UpdateType.LOCATION));
    this.bot.on(UpdateType.PHOTO, this.processUpdate(UpdateType.PHOTO));
    this.bot.on(
      UpdateType.CALLBACK_QUERY,
      this.processUpdate(UpdateType.CALLBACK_QUERY)
    );
    this.bot.on(
      UpdateType.INLINE_QUERY,
      this.processUpdate(UpdateType.INLINE_QUERY)
    );
    this.bot.on(UpdateType.TEXT, this.processUpdate(UpdateType.TEXT));
    this.bot.on(UpdateType.DOCUMENT, this.processUpdate(UpdateType.DOCUMENT));
  };

  public logWithChatId(chatId: number, ...args: any[]) {
    console.log.apply(null, [new Date(), { chatId }, ...args]);
  }

  public createPathQuery(route: string, data: Object) {
    const res = `g:${route}|${JSON.stringify(data)}`;
    return res.length > 60 ? null : res;
  }
}
