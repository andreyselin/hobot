"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var start_1 = require("./controllers/start");
var second_1 = require("./controllers/second");
// Paste your token to try basic bot functionality
var token = '844657353:AAGjlz-irZ4-mN7BmymEq-pXHTybhWUDm0w';
// Running bot wrapper
exports.hobot = new index_1.Hobot(token);
// Create your first routes pointing at their controllers
// Routes are declared inside controllers
exports.hobot.createRoute(start_1.startController);
exports.hobot.createRoute(second_1.secondController);
// After setting up your first container you probably want to use it
// when user takes first interaction with it (start command).
// Tell bot to run controller under '/start' route when /start command is received
exports.hobot.bot.start(function (ctx) { return exports.hobot.gotoPath(ctx, '/start'); });
// Yщu can create other containers and navigate to them by their path
// with hobot.gotoPath(ctx, pathString);
