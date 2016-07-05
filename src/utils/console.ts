import { Log } from '../utils/log'
import { Config } from '../config/config'

export namespace Console {
    
    export function init() {
        global['logdump'] = logdump;
        global['warnMode'] = warnMode;
        global['infoMode'] = infoMode;
        global['debugMode'] = debugMode;
        global['traceMode'] = traceMode;
    }

    export function logdump(level: Log.LEVEL = Log.LEVEL.INFO): boolean {
        let version = level >= Log.LEVEL.INFO ? 'logInfo' : 'log';
        let counter: number = 0;
        console.log('[LOG DUMP STARTING]');
        if (Memory[version])
            for (let i in Memory[version]) {
                if (Memory[version][i]['level'] >= level) {
                    console.log('[' + i + '] ' + Log.LogEntry.prototype.getLine.apply(Memory[version][i]));
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
