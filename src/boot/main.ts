import "../typings/enums";
import * as GameManager from "./../gameManager";

declare var module: any;

GameManager.globalBootstrap();

module.exports.loop = function () {
    GameManager.loop();
};
