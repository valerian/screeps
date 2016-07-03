interface Spawn {
    lastDevelopmentLevel: number;
    isMain: boolean;
}

interface Memory {
    [name: string]: {
        [name: string]: any;
    };
}
