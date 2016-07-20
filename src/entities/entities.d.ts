interface CreepRole {}

interface Creep {
    readonly level: number;
    readonly role: CreepRole;
    readonly spawnName: string;
    readonly spawn: Spawn;
}

interface Room {
    readonly spawns: Spawn[];
    readonly mainSpawn: Spawn;
}
