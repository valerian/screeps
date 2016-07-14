import { GameState } from "./gameState";

import { Config } from "./config/config";
import { Log } from "./utils/log";
import { Console } from "./utils/console";

import { Colony } from "./components/colony/colony";

import { Creep } from "./components/creep/creep";
import { Room } from "./components/room/room";

import { cleanMemory } from "./utils/helpers";


export function globalBootstrap() {
    Log.trace("bootstrap", {file: "GameManager"});
    GameState.bootstrap.broadcast();
    Log.trace("init", {file: "GameManager"});
    GameState.init.broadcast();
}

export function loop() {
    cleanMemory();
    Log.trace("loop begin", {file: "GameManager"});
    GameState.loopBegin.broadcast();
    _.forEach(Colony.getColonies(), colony => colony.run());
    Log.trace("loop end", {file: "GameManager"});
    GameState.loopEnd.broadcast();
}
