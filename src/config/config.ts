import { LogLevel } from "../typings/enums";
import * as Broadcaster from "../broadcaster";

export class Config {
    public logConsoleLevel: LogLevel = LogLevel.Info;
    public logNotifyLevel: LogLevel = LogLevel.Warn;
    public logNotifyMinutes: number = 5;
    public logMemoryLevel: LogLevel = LogLevel.Trace;
    public logMemorySize: number = 5000;
    public creepFactoryRefineIterations: number = 25;

    private initialState: {[key: string]: any};

    public load() {
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

    public save() {
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

Broadcaster.bootstrap.subscribe(() => { config.load() });
Broadcaster.loopBegin.subscribe(() => { config.load() });
