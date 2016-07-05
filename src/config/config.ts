import { Log } from '../utils/log';

export namespace Config {
    export const logConsoleLevel: Log.LEVEL = Log.LEVEL.INFO;
    export const logNotifyLevel: Log.LEVEL = Log.LEVEL.WARN;
    export const logNotifyMinutes: number = 5;
    export const logMemoryLevel: Log.LEVEL = Log.LEVEL.INFO;
    export const logMemorySize: number = 100;
}
