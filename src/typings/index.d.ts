/// <reference path="./enums.d.ts" />

interface global {
    [key: string]: any;
}

declare var global: global;

interface Memory {
    config: { [key: string]: any };
    [key: string]: {
        [key: string]: any;
    };
}

type CreepBodyPart = "move" | "work" | "carry" | "attack" | "ranged_attack" | "tough" | "heal" | "claim";
