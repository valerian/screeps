import { LogLevel } from "../typings/enums.ts";
import * as GameState from "../gameState";
import * as Log from "../utils/log";

export class Config {
    initialState: {[key: string]: any};

    logConsoleLevel: LogLevel = LogLevel.Info;
    logNotifyLevel: LogLevel = LogLevel.Warn;
    logNotifyMinutes: number = 5;
    logMemoryLevel: LogLevel = LogLevel.Trace;
    logMemorySize: number = 5000;
    creepFactoryRefineIterations: number = 25;

    load() {
        if (!Memory.config) {
            this.save();
            return;
        }
        this.initialState = {};
        _.forEach(Memory.config, (value, key) => {
            if (typeof (Config as {[key: string]: any})[key] !== "undefined") {
                (Config as {[key: string]: any})[key] = value;
                this.initialState[key] = value;
            }
        });
    }

    save() {
        Log.debug("attempting to save", { file: "config", initialStateDefined: typeof this.initialState !== "undefined", hasChanged: this._hasChanged()});
        if (typeof this.initialState !== "undefined" && !this._hasChanged())
            return;
        if (!Memory.config)
            Memory.config = {};
        _.forEach(Config, (value, key) => {
            if (key != "initialState" && !_.isFunction(value))
                Memory.config[key] = value;
        });
    }

    private _hasChanged(): boolean {
        let hasChanged = false;
        if (this.initialState)
            for (let key in this.initialState)
                if ((Config as {[key: string]: any})[key] != this.initialState[key])
                    return true;
        return false;
    }
}

let config: Config = new Config();
export default config;

GameState.bootstrap.subscribe(() => { config.load() });
GameState.loopBegin.subscribe(() => { config.load() });
