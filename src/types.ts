import { Context, Middleware } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { Hobot } from ".";

export enum UpdateType {
  DOCUMENT = "document",
  TEXT = "text",
  CALLBACK_QUERY = "callback_query",
  INLINE_QUERY = "inline_query",
  LOCATION = "location",
  PHOTO = "photo",
}
interface Command {
  command: string;
  path: string;
}

export interface Session {
  path: string;
  [k: string]: any;
}

export interface Ctx extends Context<Update> {
  session: Session;
}

export type InternalMiddleware = (
  ctx: Ctx,
  type: string,
  next?: InternalMiddleware
) => Promise<void>;

export interface GetHandlerProps {
  ctx: Ctx;
  hobot: Hobot;
  data?: any;
}

export interface PostHandlerProps {
  ctx: Ctx;
  updateType: UpdateType;
  hobot: Hobot;
  data?: any;
}

export interface Controller {
  path: string;
  get(props: GetHandlerProps): Promise<any>;
  post(props: PostHandlerProps): Promise<any>;
}

export interface HobotConfig {
  defaultPath: string;
  sessionMiddleware: Middleware<Context>;
  commands: Command[];
  controllers: Controller[];
  middlewares?: InternalMiddleware[];
  onBeforeGet?: (ctx: Ctx) => Promise<any>;
  onBeforePost?: (ctx: Ctx) => Promise<any>;
}
