import { Config } from './config/config';
import { Extensions } from './extensions';

import { Colony } from './colony';

export namespace GameManager {
    export var colonies: Colony[];

    export function globalBootstrap() {
        Extensions.init();
        colonies = Colony.findColonies();
    }

    export function loop() {
        _.forEach(colonies, (colony) => colony.run());
    }
}
