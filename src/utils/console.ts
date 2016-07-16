import * as Log from "../utils/log";
import Config from "../config/config";
import * as Debug from "./debug";
import * as Broadcaster from "../broadcaster";
import { LogLevel } from "../typings/enums";

Broadcaster.init.subscribe(() => {
    // non-function global accessors
    global.debug = Debug;

    // functions
    global.logdump = logdump;
    global.warnMode = warnMode;
    global.infoMode = infoMode;
    global.debugMode = debugMode;
    global.traceMode = traceMode;
});

export function logdump(level: LogLevel = LogLevel.Info): boolean {
    let version = level >= LogLevel.Info ? "logInfo" : "log";
    let counter: number = 0;
    console.log("[LOG DUMP STARTING]");
    if (Memory[version]) {
        for (let i in Memory[version]) {
            if ((Memory[version][i] as Log.LogEntry).level >= level) {
                console.log("[" + i + "] " + Log.LogEntry.prototype.getLine.apply(Memory[version][i]));
                counter++;
            }
        }
    }
    console.log("[LOG DUMP ENDED] [" + counter + " ENTRIES DUMPED]");
    return true;
}

export function warnMode() {
    Config.logConsoleLevel = LogLevel.Warn;
    Config.save();
}

export function infoMode() {
    Config.logConsoleLevel = LogLevel.Info;
    Config.save();
}

export function debugMode() {
    Config.logConsoleLevel = LogLevel.Debug;
    Config.save();
}

export function traceMode() {
    Config.logConsoleLevel = LogLevel.Trace;
    Config.save();
}
