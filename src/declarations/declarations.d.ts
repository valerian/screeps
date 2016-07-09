interface global {
    [key: string]: any;
}

declare var global: global;

interface Memory {
    config: { [key: string]: any }
    [key: string]: {
        [key: string]: any;
    };
}

type CreepBodyPart = 'move' | 'work' | 'carry' | 'attack' | 'ranged_attack' | 'tough' | 'heal' | 'claim';

type anyBasicCollection = {[key: number]: number} | {[key: string]: number} | {[key: number]: string} | {[key: string]: string};
type anyArrayCollection = {[key: number]: number[]} | {[key: string]: number[]} | {[key: number]: string[]} | {[key: string]: string[]};
