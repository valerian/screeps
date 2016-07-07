
export namespace Bootstrapper {
    let bootstrapFunctions: Function[] = [];
    
    export function registerBootstrapFunction(func: Function) {
        bootstrapFunctions.push(func);
    }

    export function execute() {
        for (let i in bootstrapFunctions)
            bootstrapFunctions[i]();
    }
}
