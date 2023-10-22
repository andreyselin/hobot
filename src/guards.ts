import { Message, Update } from "telegraf/typings/core/types/typegram";
import { UpdateType } from "./types";

export const isText = (
  message: Message,
  updateType: UpdateType
): message is Message.TextMessage => updateType === UpdateType.TEXT;

export const isDocument = (
  message: Message,
  updateType: UpdateType
): message is Message.DocumentMessage => updateType === UpdateType.DOCUMENT;

export const isPhoto = (
  message: Message,
  updateType: UpdateType
): message is Message.PhotoMessage => updateType === UpdateType.PHOTO;

export const isCallbackQuery = (
  update: Update,
  updateType: UpdateType
): update is Update.CallbackQueryUpdate =>
  updateType === UpdateType.CALLBACK_QUERY;
