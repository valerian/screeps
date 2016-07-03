/// <reference path="./declarations.d.ts" />

export namespace Extensions {
    
    export function init() {
        _extendSpawn();
    }

    function _extendSpawn() {
        _extendMemoryShortcut(Spawn.prototype, 'spawns', ['lastDevelopmentLevel', 'isMain'])
    }

    function _extendMemoryShortcut<T>(prototype: any, path: string, properties: string[], key: string = 'name'): void {
        let propertiesData: PropertyDescriptorMap = {};
        if (!Memory[path])
            Memory[path] = {};
        
        for (let i in properties)
            propertiesData[properties[i]] = {
                get: function () {
                    return Memory[path][this[key]] && Memory[path][this[key]][properties[i]];
                },
                set: function (value) {
                    if (!Memory[path][this[key]])
                        Memory[path][this[key]] = {};          
                    Memory[path][this[key]][properties[i]] = value;
                },
                enumerable: true,
                configurable: true
            };
        Object.defineProperties(prototype, propertiesData);
        return;
    }
}
