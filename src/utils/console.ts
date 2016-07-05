import { Log } from '../utils/log'
import { Config } from '../config/config'

export namespace Console {
    
    export function init() {
        global['dumpLogs'] = dumpLogs;
        global['warnMode'] = warnMode;
        global['infoMode'] = infoMode;
        global['debugMode'] = debugMode;
        global['traceMode'] = traceMode;
    }

    export function dumpLogs(level: Log.LEVEL = Log.LEVEL.INFO): boolean {
        let version = level >= Log.LEVEL.INFO ? 'logInfo' : 'log';
        let counter: number = 0;
        if (!Memory[version])
            return false;
        console.log('[LOG DUMP STARTING]');
        for (let i in Memory[version]) {
            if (Memory[version][i]['level'] >= level) {
                let line = new Log.LogEntry(Memory[version][i].level,
                                            Memory[version][i].message,
                                            Memory[version][i].context,
                                            Memory[version][i].date,
                                            Memory[version][i].tick);
                console.log('[' + i + '] ' + line.getLine());
                counter++;
            }
        }
        console.log('[LOG DUMP ENDED] [' + counter + ' ENTRIES DUMPED]');
        return true;
    }

    export function warnMode() {
        Config.logConsoleLevel = Log.LEVEL.WARN;
        Config.save();
    }

    export function infoMode() {
        Config.logConsoleLevel = Log.LEVEL.INFO;
        Config.save();
    }

    export function debugMode() {
        Config.logConsoleLevel = Log.LEVEL.DEBUG;
        Config.save();
    }

    export function traceMode() {
        Config.logConsoleLevel = Log.LEVEL.TRACE;
        Config.save();
    }

}
