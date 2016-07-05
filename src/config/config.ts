import { Log } from '../utils/log';

export namespace Config {
    let initialState: {[key: string]: any};
    
    export let logConsoleLevel: Log.LEVEL = Log.LEVEL.INFO;
    export let logNotifyLevel: Log.LEVEL = Log.LEVEL.WARN;
    export let logNotifyMinutes: number = 5;
    export let logMemoryLevel: Log.LEVEL = Log.LEVEL.TRACE;
    export let logMemorySize: number = 5000;

    export function load() {
        if (!Memory.config) {
            save();
            return;
        }
        initialState = {};
        _.forEach(Memory.config, (value, key) => {
            if (typeof (Config as {[key: string]: any})[key] !== 'undefined') {
                (Config as {[key: string]: any})[key] = value;
                initialState[key] = value;
            }
        });
    }

    export function save() {
        if (typeof initialState !== 'undefined' && !_hasChanged())
            return;
        if (!Memory.config)
            Memory.config = {};
        _.forEach(Config, (value, key) => {
            if (key != 'initialState' && !_.isFunction(value))
                Memory.config[key] = value;
        });
    }

    export function _hasChanged(): boolean {
        let hasChanged = false;
        if (initialState)
            _.forEach(initialState, (value, key) => {
                if ((Config as {[key: string]: any})[key] != value) {
                    return true;
                }
            });
        return false;
    }
}
