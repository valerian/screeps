import { Config } from '../config/config';

export namespace Log {
    
    export class LogEntry {
        date: string;
        tick: number;
        
        constructor(public level: LEVEL,
                    public message: string,
                    public context?: { [key: string]: string }) {
            this.date = getFormattedDate();
            this.tick = Game.time;
        }

        getLine(showLevel: boolean, showDate: boolean, showTick: boolean, showContext: boolean): string {
            let line: string = '';
            if (showLevel)
                line += '[' + LEVEL[this.level] + '] ';
            if (showDate)
                line += '[' + getFormattedDate() + '] ';
            if (showTick)
                line += '[t:' + this.tick + '] ';
            if (this.context && showContext)
                for (let key in this.context)
                    line += '[' + key + ':' + this.context[key] + '] ';
            line += this.message;
            return line;
        }
    }

    export enum LEVEL {
        OFF,
        TRACE,
        DEBUG,
        INFO,
        WARN,
        ERROR
    }

    export function trace(message: string, context?: { [key: string]: string }): LogEntry {
        return log(LEVEL.TRACE, message, context);
    }
    
    export function debug(message: string, context?: { [key: string]: string }): LogEntry {
        return log(LEVEL.DEBUG, message, context);
    }
    
    export function info(message: string, context?: { [key: string]: string }): LogEntry {
        return log(LEVEL.INFO, message, context);
    }
    
    export function warn(message: string, context?: { [key: string]: string }): LogEntry {
        return log(LEVEL.WARN, message, context);
    }
    
    export function error(message: string, context?: { [key: string]: string }): LogEntry {
        return log(LEVEL.ERROR, message, context);
    }
    
    export function log(level: LEVEL, message: string, context?: { [key: string]: string }): LogEntry {
        let entry: LogEntry = new LogEntry(level, message, context);
        if (Config.logConsoleLevel <= level)
            console.log(entry.getLine(true, true, true, true));
        if (Config.logNotifyLevel <= level)
            Game.notify(entry.getLine(true, true, true, true), Config.logNotifyMinutes);
        if (Config.logMemoryLevel <= level) {
            let memoryLog = _getMemory();
            memoryLog.unshift(entry);
            while (memoryLog.length > Config.logMemorySize)
                memoryLog.pop();
        }
        return entry;
    }

    export function getFormattedDate(): string {
        return getFormattedDate_cache || (getFormattedDate_cache = new Date().toISOString().slice(0, 19).replace('T', ' '));
    }
    let getFormattedDate_cache: string;
    
    function _getMemory(): LogEntry[] {
        if (!Memory['log'])
            Memory['log'] = new Array<LogEntry>();
        return <LogEntry[]> Memory['log'];
    }
}
