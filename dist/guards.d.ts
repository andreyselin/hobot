import { Message, Update } from "telegraf/typings/core/types/typegram";
import { UpdateType } from "./types";
export declare const isText: (message: Message, updateType: UpdateType) => message is Message.TextMessage;
export declare const isDocument: (message: Message, updateType: UpdateType) => message is Message.DocumentMessage;
export declare const isPhoto: (message: Message, updateType: UpdateType) => message is Message.PhotoMessage;
export declare const isCallbackQuery: (update: Update, updateType: UpdateType) => update is Update.CallbackQueryUpdate;
//# sourceMappingURL=guards.d.ts.map