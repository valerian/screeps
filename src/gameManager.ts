import { Config } from './config/config';
import { Extensions } from './extensions/extensions';
import { Log } from './utils/log';
import { Console } from './utils/console';

import { Colony } from './colony/colony';

export namespace GameManager {
    export var colonies: Colony[];

    export function globalBootstrap() {
        Log.trace('bootstrapping', {file: 'GameManager'});
        Extensions.init();
        Config.load();
        Console.init();
    }

    export function loop() {
        Log.trace('looping', {file: 'GameManager'});
        Config.load();
        colonies = Colony.findColonies();
        _.forEach(colonies, (colony) => colony.run());
    }
}
