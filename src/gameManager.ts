import { Config } from './config/config';
import { Extensions } from './extensions';

export namespace GameManager {

    export function globalBootstrap() {
        Extensions.init();
    }

    export function loop() {

    }
}
