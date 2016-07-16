import Colony from "../colony";

export default class ColonyQueen {
    public colony: Colony;
    public needEnergy: boolean;

    public constructor(colony: Colony) {
        this.colony = colony;
        this.needEnergy = false;
    }
}
