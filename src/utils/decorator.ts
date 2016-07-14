
export function Memoized(target:any, propertyKey:string, descriptor:PropertyDescriptor) {
    let value:any;
    let originalGet = descriptor.get;

    descriptor.get = function() {
        if(!this.hasOwnProperty("__memoized__"))
            Object.defineProperty(this, "__memoized__", { value: new Map() });

        return this.__memoized__.has(propertyKey) ?
                this.__memoized__.get(propertyKey) :
                (() => {
                    const value = originalGet.call(this);
                    this.__memoized__.set(propertyKey, value);
                    return value;

                })();
    };
}
