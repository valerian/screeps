import { CreepRole } from '../../declarations/declarations';

export class CreepFactoryComponent {
    public part: CreepBodyPart;
    public ratioWeight: number;
    public minimum: number;
    public maximum: number;
    public isRatioEnforced: boolean;
    public get cost() { return BODYPART_COST[this.part]; }

    public constructor(part: CreepBodyPart, ratio: number) {
        this.part = part;
        this.ratioWeight = ratio;
    }

    public setMinimum(value: number): CreepFactoryComponent {
        this.minimum = value;
        return this;
    }

    public setMaximum(value: number): CreepFactoryComponent {
        this.maximum = value;
        return this;
    }

    public enforceRatio(): CreepFactoryComponent {
        this.isRatioEnforced = true;
        return this;
    }
}
