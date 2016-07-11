/// <reference path="./creep.d.ts" />

import { Bootstrapper } from '../../bootstrapper.ts';

export namespace Creep {}

class Creep_EXTENSION extends Creep {
    get level(): number {
        return this.memory['level'];
    }

    get role(): CreepRole {
        return this.memory['role'];
    }

    get spawnName(): string {
        return this.memory['spawn'];
    }

    get spawn(): Spawn {
        return Game.spawns[this.memory['spawn']];
    }
}

Bootstrapper.safeExtendPrototype(Creep, Creep_EXTENSION);
