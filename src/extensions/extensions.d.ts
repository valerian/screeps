
interface Spawn {
    lastDevelopmentLevel: number;
    isMain: boolean;
}

interface Room {
    my: boolean;
    spawns: Spawn[];
    mainSpawn: Spawn;
}

interface Creep {
    level: number;
    motherName: string;
    mother: any;
    role: string;
    task: any;
}

