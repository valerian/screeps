import * as CreepFactory from "../components/creepFactory/index";
import Config from "../config/config";
import * as Log from "../utils/log";
import { CreepRole, LogLevel } from "../typings/enums";

export function creepFactory(role: number = CreepRole.Miner) {
    let previousLogLevel: LogLevel = Config.logConsoleLevel;

    Config.logConsoleLevel = LogLevel.Debug;

    Log.debug("design blueprint test for " + CreepRole[role], "Debug.creepFactory");

    for (let cost = 0; cost <= 1300; cost += 50) {
        CreepFactory.designBlueprint(role, cost);
    }

    Config.logConsoleLevel = previousLogLevel;
}
