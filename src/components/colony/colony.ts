import * as Log from "../../utils/log";
import ColonyArchitect from "./managers/architect";
import ColonyGeneral from "./managers/general";
import ColonyOverseer from "./managers/overseer";
import ColonyQueen from "./managers/queen";

export default class Colony {
    public static getColonies(): Colony[] {
        if (!this.colonies) {
            this.colonies = new Array<Colony>();
            let myRooms: Room[] = _.filter(Game.rooms, (r) => r.mainSpawn && r.mainSpawn.my);
            for (let i: number = 0; i < myRooms.length; i++) {
                this.colonies.push(new Colony(myRooms[i]));
            }
        }
        return this.colonies;
    }

    private static colonies: Colony[];

    public room: Room;
    public spawn: Spawn;
    public controller: Controller;
    public architect: ColonyArchitect;
    public general: ColonyGeneral;
    public overseer: ColonyOverseer;
    public queen: ColonyQueen;

    public get creeps() {
        return _.filter(Game.creeps, creep => creep.spawnName);
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
        Log.trace("colony \"" + this.room.name + "\" running", "Colony.run", { room: this.room.name });
        _.forEach(this.creeps, creep => {
            creep.say("I'm a " + creep.role + "!");
        });
    }
}
