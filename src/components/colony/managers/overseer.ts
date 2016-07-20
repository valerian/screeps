import Colony from "../colony";

export default class ColonyOverseer {
    public readonly colony: Colony;

    public constructor(colony: Colony) {
        this.colony = colony;
    }
}
