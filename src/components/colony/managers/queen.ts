import { Colony } from "../colony"
import { CreepFactory } from "../../creepFactory/index"

export class ColonyQueen {
    public colony: Colony;
    public needEnergy: boolean;

    public constructor(colony: Colony) {
        this.colony = colony;
        this.needEnergy = false;
    }
}
