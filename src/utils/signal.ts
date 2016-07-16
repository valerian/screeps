
export class Signal {
    private _callbacks: { (): any }[];

    constructor() {
        this._callbacks = new Array< { (): any } >();
    }

    public subscribe(callback: { (): any }) {
        if (callback) {
            this._callbacks.push(callback);
        }
    }

    public broadcast() {
        for (let i in this._callbacks) {
            this._callbacks[i]();
        }
    }
}
