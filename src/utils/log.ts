import Config from "../config/config";
import { LogLevel } from "../declarations/enums";
import * as Broadcaster from "../broadcaster.ts";

export function trace(message: string, origin: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Trace, message, origin, context);
}

export function debug(message: string, origin: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Debug, message, origin, context);
}

export function info(message: string, origin: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Info, message, origin, context);
}

export function warn(message: string, origin: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Warn, message, origin, context);
}

export function error(message: string, origin: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Error, message, origin, context);
}

export function log(level: LogLevel, message: string, origin: string, context?: { [key: string]: any }): LogEntry {
    const entry: LogEntry = new LogEntry(level, message, origin, context);
    if (level >= Config.logConsoleLevel) {
        console.log(entry.getLine(true, false, false, true, true));
    }
    if (level >= Config.logNotifyLevel) {
        Game.notify(entry.getLine(true, true, true, true, true), Config.logNotifyMinutes);
    }
    if (level >= Config.logMemoryLevel) {
        const memoryLog = _getMemory();
        memoryLog.unshift(entry);
        while (memoryLog.length > Config.logMemorySize) {
            memoryLog.pop();
        }
    }
    if (level >= LogLevel.Info) {
        const memoryLogInfo = _getMemoryInfo();
        memoryLogInfo.unshift(entry);
        while (memoryLogInfo.length > Config.logMemorySize) {
            memoryLogInfo.pop();
        }
    }
    return entry;
}

export class LogEntry {

    constructor(public level: LogLevel,
                public message: string,
                public origin: string,
                public context?: { [key: string]: any },
                public date?: string,
                public tick?: number) {
        this.date = date || _getFormattedDate();
        this.tick = tick || Game.time;
    }

    public getLine(showLevel: boolean = true,
                   showDate: boolean = true,
                   showTick: boolean = true,
                   showOrigin: boolean = true,
                   showContext: boolean = true): string {
        let line: string = "";
        if (showLevel) {
            line += "[" + LogLevel[this.level] + "] ";
        }
        if (showDate) {
            line += "[" + _getFormattedDate() + "] ";
        }
        if (showTick) {
            line += "[tick:" + this.tick + "] ";
        }
        if (showOrigin) {
            line += "[at " + this.origin + "] ";
        }
        if (this.context && showContext) {
            line += "- ";
            for (let key in this.context) {
                line += "[" + key + ":" + this.context[key] + "] ";
            }
        }
        line += "- ";
        line += this.message;
        return line;
    }
}

function _getFormattedDate(): string {
    return _getFormattedDateCache || (_getFormattedDateCache = new Date().toISOString().slice(0, 19).replace("T", " "));
}
let _getFormattedDateCache: string | undefined;
Broadcaster.loopBegin.subscribe(() => { _getFormattedDateCache = undefined; });

function _getMemory(): LogEntry[] {
    if (!Memory.log) {
        Memory.log = new Array<LogEntry>();
    }
    return <LogEntry[]> Memory.log;
}

function _getMemoryInfo(): LogEntry[] {
    if (!Memory.logInfo) {
        Memory.logInfo = new Array<LogEntry>();
    }
    return <LogEntry[]> Memory.logInfo;
}
