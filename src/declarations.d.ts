interface Spawn {
    spooked: number;
    lastDevelopmentLevel: number;
    isMain: boolean;
}

interface Memory {
    [name: string]: {
        [name: string]: any;
    };
}
