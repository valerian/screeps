/// <reference path="./room.d.ts" />

import { Bootstrapper } from '../../bootstrapper.ts';

export namespace Room {}

class Room_EXTENSION extends Room {
    get spawns(): Spawn[] {
        return _.filter(Game.spawns, (spawn) => spawn.room.name == this.name);
    }

    get mainSpawn(): Spawn {
        return this.spawns[0];
    }
}

Bootstrapper.safeExtendPrototype(Room, Room_EXTENSION);
