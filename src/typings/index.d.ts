// tslint:disable-next-line: class-name
interface global {
    debug: any;
    logdump: any;
    warnMode: any;
    infoMode: any;
    debugMode: any;
    traceMode: any;
    [key: string]: any;
}

declare var global: global;

interface Memory {
    config: { [key: string]: any };
    log: any[];
    logInfo: any[];
    [key: string]: {
        [key: string]: any;
    };
}

type CreepBodyPart = "move" | "work" | "carry" | "attack" | "ranged_attack" | "tough" | "heal" | "claim";
