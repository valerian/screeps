import { Signal } from "./utils/signal";

export const bootstrap: Signal = new Signal();
export const init: Signal = new Signal();
export const loopBegin: Signal = new Signal();
export const loopEnd: Signal = new Signal();
