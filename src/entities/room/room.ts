import { safeExtendPrototype } from "../../utils/reflection";

class RoomExtension extends Room {
    get spawns(): Spawn[] {
        return _.filter(Game.spawns, (spawn) => spawn.room.name === this.name);
    }

    get mainSpawn(): Spawn {
        return this.spawns[0];
    }
}

safeExtendPrototype(Room, RoomExtension);
