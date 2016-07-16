import "./entities/index";
import "./config/config";
import "./config/creepFactoryConfig";
import "./utils/console";
import * as Log from "./utils/log";
import * as Broadcaster from "./broadcaster";
import { cleanMemory } from "./utils/helpers";
import Colony from "./components/colony/colony";

Log.trace("bootstrap", "main");
Broadcaster.bootstrap.broadcast();
Log.trace("init", "main");
Broadcaster.init.broadcast();

// this function must always be declared as "export function loop()" for screeps to run
export function loop() {
    cleanMemory();
    Log.trace("loop begin", "main.loop");
    Broadcaster.loopBegin.broadcast();
    _.forEach(Colony.getColonies(), colony => colony.run());
    Log.trace("loop end", "main.loop");
    Broadcaster.loopEnd.broadcast();
}
