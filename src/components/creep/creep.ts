import "./creep.d.ts";
import { safeExtendPrototype } from "../../utils/reflection";
import { CreepRole } from "../../typings/enums";

class CreepExtension extends Creep {
    get level(): number {
        return this.memory.level;
    }

    get role(): CreepRole {
        return this.memory.role;
    }

    get spawnName(): string {
        return this.memory.spawn;
    }

    get spawn(): Spawn {
        return Game.spawns[this.memory.spawn];
    }
}

safeExtendPrototype(Creep, CreepExtension);
