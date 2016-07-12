import { Signal } from './utils/signal';

export namespace GameState {
    export let bootstrap: Signal = new Signal();
    export let init: Signal = new Signal();
    export let loopBegin: Signal = new Signal();
    export let loopEnd: Signal = new Signal();
}