/// <reference path="./room.d.ts" />

import { safeExtendPrototype } from '../../utils/reflection';

export namespace Room {}

class Room_EXTENSION extends Room {
    get spawns(): Spawn[] {
        return _.filter(Game.spawns, (spawn) => spawn.room.name == this.name);
    }

    get mainSpawn(): Spawn {
        return this.spawns[0];
    }
}

safeExtendPrototype(Room, Room_EXTENSION);
