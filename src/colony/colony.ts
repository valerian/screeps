import { Log } from '../utils/log';

export class Colony {
    public room: Room;
    public spawn: Spawn;
    public controller: Controller;

    public static findColonies(): Colony[] {
        let colonies = new Array<Colony>();
        let myRooms = _.filter(Game.rooms, (r) => r.mainSpawn && r.mainSpawn.my);
        for (let i in myRooms)
            colonies.push(new Colony(myRooms[i]));
        return colonies;
    }
    
    constructor(room: Room) {
        this.room = room;
        this.spawn = room.mainSpawn;
        this.controller = room.controller;
    }

    public run(): void {
        Log.trace('colony "' + this.room.name + '" running', { file: 'colony', room: this.room.name });
    }
}
