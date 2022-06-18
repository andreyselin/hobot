"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCallbackQuery = exports.isPhoto = exports.isDocument = exports.isText = void 0;
const types_1 = require("./types");
const isText = (message, updateType) => updateType === types_1.UpdateType.TEXT;
exports.isText = isText;
const isDocument = (message, updateType) => updateType === types_1.UpdateType.DOCUMENT;
exports.isDocument = isDocument;
const isPhoto = (message, updateType) => updateType === types_1.UpdateType.PHOTO;
exports.isPhoto = isPhoto;
const isCallbackQuery = (update, updateType) => updateType === types_1.UpdateType.CALLBACK_QUERY;
exports.isCallbackQuery = isCallbackQuery;
//# sourceMappingURL=guards.js.map