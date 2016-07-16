import "./entities/index";
import "./config/config";
import "./config/creepFactoryConfig";
import "./utils/console";
import * as Log from "./utils/log";
import * as Broadcaster from "./broadcaster";
import { cleanMemory } from "./utils/helpers";
import Colony from "./components/colony/colony";

Log.trace("bootstrap", {file: "GameManager"});
Broadcaster.bootstrap.broadcast();
Log.trace("init", {file: "GameManager"});
Broadcaster.init.broadcast();

// this function must always be declared as "export function loop()" for screeps to run
export function loop() {
    cleanMemory();
    Log.trace("loop begin", {file: "GameManager"});
    Broadcaster.loopBegin.broadcast();
    _.forEach(Colony.getColonies(), colony => colony.run());
    Log.trace("loop end", {file: "GameManager"});
    Broadcaster.loopEnd.broadcast();
}
