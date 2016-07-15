import "./components/creep/creep";
import "./components/room/room";

import "./config/config";
import "./utils/console";

import * as GameState from "./gameState";
import * as Log from "./utils/log";
import { cleanMemory } from "./utils/helpers";
import Colony from "./components/colony/colony";

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
