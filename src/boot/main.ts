/**
 * Application bootstrap.
 * BEFORE CHANGING THIS FILE, make sure you read this:
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * Write your code to GameManager class in ./src/gameManager.ts
 */

import { GameManager } from './../gameManager';

declare var module: any;

GameManager.globalBootstrap();

module.exports.loop = function () {
    GameManager.loop();
};
