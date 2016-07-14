import { Log } from "../utils/log"
import { Config } from "../config/config"
import { Debug } from "../debug/debug";
import { GameState } from "../gameState"

export namespace Console {

    GameState.init.subscribe(() => {
        // non-function global accessors
        global["debug"] = Debug;

        // functions
        global["logdump"] = logdump;
        global["warnMode"] = warnMode;
        global["infoMode"] = infoMode;
        global["debugMode"] = debugMode;
        global["traceMode"] = traceMode;
    });

    export function logdump(level: Log.Level = Log.Level.Info): boolean {
        let version = level >= Log.Level.Info ? "logInfo" : "log";
        let counter: number = 0;
        console.log("[LOG DUMP STARTING]");
        if (Memory[version])
            for (let i in Memory[version]) {
                if (Memory[version][i]["level"] >= level) {
                    console.log("[" + i + "] " + Log.LogEntry.prototype.getLine.apply(Memory[version][i]));
                    counter++;
                }
            }
        console.log("[LOG DUMP ENDED] [" + counter + " ENTRIES DUMPED]");
        return true;
    }

    export function warnMode() {
        Config.logConsoleLevel = Log.Level.Warn;
        Config.save();
    }

    export function infoMode() {
        Config.logConsoleLevel = Log.Level.Info;
        Config.save();
    }

    export function debugMode() {
        Config.logConsoleLevel = Log.Level.Debug;
        Config.save();
    }

    export function traceMode() {
        Config.logConsoleLevel = Log.Level.Trace;
        Config.save();
    }
}
