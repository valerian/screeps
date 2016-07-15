import Colony from "../colony";
import * as CreepFactory from "../../creepFactory/index";

export default class ColonyQueen {
    public colony: Colony;
    public needEnergy: boolean;

    public constructor(colony: Colony) {
        this.colony = colony;
        this.needEnergy = false;
    }
}
