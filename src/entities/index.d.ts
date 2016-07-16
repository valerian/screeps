interface CreepRole {}

interface Creep {
    level: number;
    role: CreepRole;
    spawnName: string;
    spawn: Spawn;
}

interface Room {
    spawns: Spawn[];
    mainSpawn: Spawn;
}
