import { CreepFactory } from '../components/creepFactory/creepFactory'
import { Config } from '../config/config'
import { Log } from '../utils/log';

export namespace Debug {

    export function creepFactory(role: number = CreepRole.Miner) {
        let previousLogLevel: Log.Level = Config.logConsoleLevel;

        Config.logConsoleLevel = Log.Level.Debug;

        Log.debug('design blueprint test for ' + CreepRole[role]);

        for (let cost = 0; cost <= 1300; cost += 50) {
            CreepFactory.designBlueprint(role, cost);
        }

        Config.logConsoleLevel = previousLogLevel;
    }
}