import Colony from "../colony";

export default class ColonyOverseer {
    public colony: Colony;

    public constructor(colony: Colony) {
        this.colony = colony;
    }
}
