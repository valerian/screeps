import Config from "../config/config";
import { LogLevel } from "../typings/enums.ts";

export class LogEntry {
    constructor(public level: LogLevel,
                public message: string,
                public context?: { [key: string]: any },
                public date?: string,
                public tick?: number) {
        this.date = date || _getFormattedDate();
        this.tick = tick || Game.time;
    }

    getLine(showLevel: boolean = true, showDate: boolean = true, showTick: boolean = true, showContext: boolean = true): string {
        let line: string = "";
        if (showLevel)
            line += "[" + LogLevel[this.level] + "] ";
        if (showDate)
            line += "[" + _getFormattedDate() + "] ";
        if (showTick)
            line += "[t:" + this.tick + "] ";
        if (this.context && showContext)
            for (let key in this.context)
                line += "[" + key + ":" + this.context[key] + "] ";
        line += this.message;
        return line;
    }
}

export function trace(message: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Trace, message, context);
}

export function debug(message: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Debug, message, context);
}

export function info(message: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Info, message, context);
}

export function warn(message: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Warn, message, context);
}

export function error(message: string, context?: { [key: string]: any }): LogEntry {
    return log(LogLevel.Error, message, context);
}

export function log(level: LogLevel, message: string, context?: { [key: string]: any }): LogEntry {
    let entry: LogEntry = new LogEntry(level, message, context);
    if (level >= Config.logConsoleLevel)
        console.log(entry.getLine(true, false, false, true));
    if (level >= Config.logNotifyLevel)
        Game.notify(entry.getLine(true, true, true, true), Config.logNotifyMinutes);
    if (level >= Config.logMemoryLevel) {
        let memoryLog = _getMemory();
        memoryLog.unshift(entry);
        while (memoryLog.length > Config.logMemorySize)
            memoryLog.pop();
    }
    if (level >= LogLevel.Info) {
        let memoryLogInfo = _getMemoryInfo();
        memoryLogInfo.unshift(entry);
        while (memoryLogInfo.length > Config.logMemorySize)
            memoryLogInfo.pop();
    }
    return entry;
}

function _getFormattedDate(): string {
    return getFormattedDate_cache || (getFormattedDate_cache = new Date().toISOString().slice(0, 19).replace("T", " "));
}
let getFormattedDate_cache: string;

function _getMemory(): LogEntry[] {
    if (!Memory["log"])
        Memory["log"] = new Array<LogEntry>();
    return <LogEntry[]> Memory["log"];
}

function _getMemoryInfo(): LogEntry[] {
    if (!Memory["logInfo"])
        Memory["logInfo"] = new Array<LogEntry>();
    return <LogEntry[]> Memory["logInfo"];
}
