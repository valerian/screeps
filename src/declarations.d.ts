interface Spawn {
    lastDevelopmentLevel: number;
    isMain: boolean;
}

interface Room {
    my: boolean;
    spawns: Spawn[];
    mainSpawn: Spawn;
}

interface Memory {
    [name: string]: {
        [name: string]: any;
    };
}
