import Colony from "../colony";

export default class ColonyQueen {
    public readonly colony: Colony;
    public readonly needEnergy: boolean;

    public constructor(colony: Colony) {
        this.colony = colony;
        this.needEnergy = false;
    }
}
