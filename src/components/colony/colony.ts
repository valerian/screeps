import { Log } from '../../utils/log';
import { ColonyArchitect } from './managers/architect'
import { ColonyGeneral } from './managers/general'
import { ColonyOverseer } from './managers/overseer'
import { ColonyQueen } from './managers/queen'

export class Colony {
    private static colonies: Colony[];

    public room: Room;
    public spawn: Spawn;
    public controller: Controller;
    public architect: ColonyArchitect;
    public general: ColonyGeneral;
    public overseer: ColonyOverseer;
    public queen: ColonyQueen;

    public static getColonies(): Colony[] {
        if (!this.colonies) {
            this.colonies = new Array<Colony>();
            let myRooms = _.filter(Game.rooms, (r) => r.mainSpawn && r.mainSpawn.my);
            for (let i in myRooms)
                this.colonies.push(new Colony(myRooms[i]));
        }
        return this.colonies;
    }

    constructor(room: Room) {
        this.room = room;
        this.spawn = room.mainSpawn;
        this.controller = room.controller;
        this.architect = new ColonyArchitect(this);
        this.general = new ColonyGeneral(this);
        this.overseer = new ColonyOverseer(this);
        this.queen = new ColonyQueen(this);
    }

    public run(): void {
        Log.trace('colony "' + this.room.name + '" running', { file: 'colony', room: this.room.name });
    }
}
