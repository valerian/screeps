import { GameState } from '../gameState';
import { Log } from '../utils/log';

export namespace Config {
    let initialState: {[key: string]: any};

    export let logConsoleLevel: Log.Level = Log.Level.Info;
    export let logNotifyLevel: Log.Level = Log.Level.Warn;
    export let logNotifyMinutes: number = 5;
    export let logMemoryLevel: Log.Level = Log.Level.Trace;
    export let logMemorySize: number = 5000;
    export let creepFactoryRefineIterations: number = 25;

    GameState.bootstrap.subscribe(() => { load() });
    GameState.loopBegin.subscribe(() => { load() });

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
        Log.debug('attempting to save', { file: 'config', initialStateDefined: typeof initialState !== 'undefined', hasChanged:_hasChanged()});
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
            for (let key in initialState)
                if ((Config as {[key: string]: any})[key] != initialState[key])
                    return true;
        return false;
    }
}
