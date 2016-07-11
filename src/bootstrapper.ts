
export namespace Bootstrapper {
    let bootstrapFunctions: Function[] = [];

    export function registerBootstrapFunction(func: Function) {
        bootstrapFunctions.push(func);
    };

    export function execute() {
        for (let i in bootstrapFunctions)
            bootstrapFunctions[i]();
    };

    export function safeExtendPrototype(extended: any, extender: any) {
        let properties: string[] = Object.getOwnPropertyNames(extender.prototype);
        for (let i in properties)
            if (!extended.prototype.hasOwnProperty(properties[i]))
                Object.defineProperty(
                    extended.prototype,
                    properties[i],
                    Object.getOwnPropertyDescriptor(extender.prototype, properties[i]));
    }
}
