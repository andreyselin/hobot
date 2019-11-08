"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var start_1 = require("./controllers/start");
var second_1 = require("./controllers/second");
var telegraf_1 = __importDefault(require("telegraf"));
// Paste your token to try basic bot functionality
var token = '864069020:AAEpCAnO-8sQp3sWA84CkopofdvYOM5Z2EY';
// Running bot with specific telegraf config
var bot = new telegraf_1.default(token /* , { Your telegraf config }*/);
// Running Hobot framework
exports.hobot = new index_1.Hobot(bot, {
    i18n: {
        use: false,
        default: 'en',
        // Make sure this directory exists:
        path: __dirname + '/locales'
    }
});
// Create your first routes pointing at their controllers
// Routes are declared inside controllers
exports.hobot.createRoute(start_1.startController);
exports.hobot.createRoute(second_1.secondController);
// After setting up your first controller you probably want to use it
// when user takes first interaction with it (start command).
// Tell bot to run controller under '/start' route when /start command is received
exports.hobot.bot.start(function (ctx) { return exports.hobot.gotoPath(ctx, '/start'); });
// You can create other containers and navigate to them by their paths
// with hobot.gotoPath(ctx, pathString);
