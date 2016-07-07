import { Bootstrapper } from './bootstrapper';

import { Declarations } from './declarations/declarations';

import { Config } from './config/config';
import { Extensions } from './extensions/extensions';
import { Log } from './utils/log';
import { Console } from './utils/console';

import { Colony } from './colony/colony';

export namespace GameManager {
    
    export function globalBootstrap() {
        Log.trace('bootstrapping', {file: 'GameManager'});
        Config.load();
        Bootstrapper.execute();
    }

    export function loop() {
        _cleanMemory();
        Log.trace('looping', {file: 'GameManager'});
        Config.load();
        _.forEach(Colony.getColonies(), (colony) => colony.run());
    }

    function _cleanMemory()
    {
        for (let key in ['creeps', 'spawns', 'rooms', 'flags'])
            for (let i in Memory[key])
                if(!(Game as { [name: string]: any })[key][i])
                    delete Memory[key][i];
    }
}
