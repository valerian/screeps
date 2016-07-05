/// <reference path="./extensions.d.ts" />

export namespace Extensions {
    
    export function init() {
        // Spawn
        extendMemoryShortcut(Spawn.prototype, 'spawns', ['lastDevelopmentLevel', 'isMain']);

        // Room
        extendMemoryShortcut(Room.prototype, 'rooms', ['my']);
        extendGetterMemoized(Room.prototype, 'spawns', (self:Room) => {
            return _.filter(Game.spawns, (spawn) => spawn.room.name == self.name);
        });        
        extendGetterMemoized(Room.prototype, 'mainSpawn', (self:Room) => {
            return self.spawns[0];
        });

        // Creep
        extendMemoryShortcut(Creep.prototype, 'creeps', ['level', 'motherName', 'role', 'task']);
        extendGetter(Creep.prototype, 'mother', (self:Creep) => {
            return Game.spawns[self.motherName];
        });        
    }

    export function extendMemoryShortcut(prototype: any, path: string, properties: string[], key: string = 'name'): void {
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

    export function extendGetter(prototype: any, property: string, func: (self:any) => any): void {
        Object.defineProperty(prototype, property, {
            get: function () {
                return func(this);
            },
            enumerable: true,
            configurable: true
        });
        return;
    }

    export function extendGetterMemoized(prototype: any, property: string, func: (self:any) => any): void {
        
        Object.defineProperty(prototype, property, {
            get: function () {
                
                if (!this.hasOwnProperty('__memoized__')) {
                    Object.defineProperty(this, '__memoized__', { value: new Map() });                
                }
                
                return this.__memoized__.has(property) ?
                        this.__memoized__.get(property) :
                        (() => {
                            const value = func(this);
                            this.__memoized__.set(property, value);
                            return value;
                        })();
            },
            enumerable: true,
            configurable: true
        });
        return;
    }
}
