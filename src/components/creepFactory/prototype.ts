import { CreepRole } from '../../declarations/declarations';
import { CreepFactory } from './creepFactory.ts';
import { CreepFactoryComponent } from './component';
import { invertObjectStringNumber } from '../../utils/helpers';

export class CreepFactoryPrototype {
    protected isDesigned: boolean;
    protected desiredCost: number;
    protected recipe: CreepFactoryComponent[];
    protected averagePartCost: number;
    protected ratioSum: number;
    protected _design: {[part: string]: number};
    protected _currentCost: number;
    protected _totalParts: number;
    public get design(): {[part: string]: number} {
        return this._design;
    }
    public get currentCost(): number {
        return this._currentCost ||
                (this._currentCost = _.sum(this.recipe, (component) => component.cost * this._design[component.part]));
    }
    public get totalParts(): number {
        return this._totalParts ||
                (this._totalParts = _.sum(this._design));
    }

    public constructor(recipe: CreepFactoryComponent[], desiredCost: number) {
        this.desiredCost = desiredCost;
        this.recipe = recipe;
        this._design = {};
        this.ratioSum = 0;
        this.averagePartCost = 0;

        for (let i in this.recipe) {
            this.ratioSum += recipe[i].ratioWeight;
            this.averagePartCost += recipe[i].ratioWeight * recipe[i].cost;
        }
        this.averagePartCost /= this.ratioSum;
    }

    protected invalidateCache() {
        this._currentCost = undefined;
        this._totalParts = undefined;
    }

    public createRoughDesign(): boolean {
        if (this.desiredCost <= 0)
            return false;

        let limitingFactor = 1;
        if (this.desiredCost / this.averagePartCost > MAX_CREEP_SIZE)
            limitingFactor = MAX_CREEP_SIZE / (this.desiredCost / this.averagePartCost)

        for (let i in this.recipe) {
            let portion = Math.floor((this.recipe[i].ratioWeight / this.ratioSum) *
                                     (this.desiredCost / this.averagePartCost) *
                                     limitingFactor);
            if (this.recipe[i].minimum && portion < this.recipe[i].minimum)
                portion = this.recipe[i].minimum;
            if (this.recipe[i].maximum && portion > this.recipe[i].maximum)
                portion = this.recipe[i].maximum;
            this._design[this.recipe[i].part] = portion;
        }

        this.invalidateCache();

        if (this.totalParts == 0)
            return false;

        return true;
    }

    public tryRemovePart(): boolean {
        let highestRatioDeviationPart: string;
        let highestRatioDeviationScore: number;

        for (let i in this.recipe) {
            if (this._design[this.recipe[i].part] == 0 || this.recipe[i].minimum && this._design[this.recipe[i].part] == this.recipe[i].minimum)
                continue;
            let currentRatio = this._design[this.recipe[i].part] / this.totalParts;
            let reducedRatio = (this._design[this.recipe[i].part] - 1) / (this.totalParts - 1);
            if (this.recipe[i].isRatioEnforced && reducedRatio < (this.recipe[i].ratioWeight / this.ratioSum))
                continue;
            let currentRatioDeviation = currentRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            let reducedRatioDeviation = reducedRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            let ratioDeviationScore = currentRatioDeviation + reducedRatioDeviation;
            if (typeof highestRatioDeviationScore == undefined || ratioDeviationScore > highestRatioDeviationScore) {
                highestRatioDeviationPart = this.recipe[i].part;
                highestRatioDeviationScore = ratioDeviationScore;
            }
        }

        if (!highestRatioDeviationPart)
            return false;

        this._design[highestRatioDeviationPart]--;
        this.invalidateCache();

        if (this.totalParts == 0)
            return false;

        return true;
    }

    public tryAddPart(): boolean {
        let lowestRatioDeviationPart: string;
        let lowestRatioDeviationScore: number;

        for (let i in this.recipe) {
            if (this.recipe[i].isRatioEnforced &&
                (this._design[this.recipe[i].part] / (this.totalParts + 1)) < (this.recipe[i].ratioWeight / this.ratioSum)) {
                if (this.recipe[i].cost + this.currentCost > this.desiredCost ||
                    this.recipe[i].maximum && this._design[this.recipe[i].part] == this.recipe[i].maximum)
                    lowestRatioDeviationPart = undefined;
                else
                    lowestRatioDeviationPart = this.recipe[i].part;
                break;
            }
            if (this.recipe[i].cost + this.currentCost > this.desiredCost ||
                this.recipe[i].maximum && this._design[this.recipe[i].part] == this.recipe[i].maximum)
                continue;
            let currentRatio = this._design[this.recipe[i].part] / this.totalParts;
            let increasedRatio = (this._design[this.recipe[i].part] + 1) / (this.totalParts + 1);
            let currentRatioDeviation = currentRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            let increasedRatioDeviation = increasedRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            let ratioDeviationScore = currentRatioDeviation + increasedRatioDeviation;
            if (typeof lowestRatioDeviationScore === 'undefined' || ratioDeviationScore < lowestRatioDeviationScore) {
                lowestRatioDeviationPart = this.recipe[i].part;
                lowestRatioDeviationScore = ratioDeviationScore;
            }
        }

        if (typeof lowestRatioDeviationPart === 'undefined')
            return false;

        this._design[lowestRatioDeviationPart]++;
        this.invalidateCache();

        return true;
    }

    public tryEnforceRatio(): boolean {
        let highestDeviationEnforcablePart: string;
        let highestDeviationEnforcableScore: number;

        for (let i in this.recipe) {
            if (!this.recipe[i].isRatioEnforced ||
                this._design[this.recipe[i].part] == 0 ||
                this.recipe[i].minimum && this._design[this.recipe[i].part] == this.recipe[i].minimum)
                continue;
            let currentRatio = this._design[this.recipe[i].part] / this.totalParts;
            let reducedRatio = (this._design[this.recipe[i].part] - 1) / (this.totalParts - 1);
            let reducedOtherRatio = this._design[this.recipe[i].part] / (this.totalParts - 1);
            if (reducedOtherRatio < (this.recipe[i].ratioWeight / this.ratioSum)) {
                if (reducedRatio < (this.recipe[i].ratioWeight / this.ratioSum))
                    highestDeviationEnforcablePart = undefined;
                else
                    highestDeviationEnforcablePart = this.recipe[i].part;
                break;
            }
            if (reducedRatio < (this.recipe[i].ratioWeight / this.ratioSum)) {
                continue;
            }
            let currentRatioDeviation = currentRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            let reducedRatioDeviation = reducedRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            let ratioDeviationScore = currentRatioDeviation + reducedRatioDeviation;
            if (typeof highestDeviationEnforcableScore === 'undefined' || ratioDeviationScore > highestDeviationEnforcableScore) {
                highestDeviationEnforcablePart = this.recipe[i].part;
                highestDeviationEnforcableScore = ratioDeviationScore;
            }
        }

        if (typeof highestDeviationEnforcablePart === 'undefined')
            return false;

        this._design[highestDeviationEnforcablePart]--;
        this.invalidateCache();

        return true;
    }

    public assembleBluePrint(partOrders: {[part: string /* CreepBodyPart */ ]: number}): CreepBodyPart[] {
        let invertPartOrders: {[priority: number]: string[]} = invertObjectStringNumber(partOrders);
        let priorities: number[] = _.uniq(_.values(partOrders)).sort() as number[];
        let result: CreepBodyPart[] = [];
        let designCountdown: { [part: string]: number } = _.clone(this.design);

        for (let priority in priorities) {
            let partsAffected: number;
            do {
                partsAffected = 0;
                let parts: string[] = invertPartOrders[priorities[priority]];
                let counts: { [part: string]: number } = {};
                let totalCount: number = 0;
                for (let part in parts) {
                    totalCount += designCountdown[parts[part]];
                    counts[part] = designCountdown[parts[part]];
                }
                for (let part in parts)
                    if (designCountdown[parts[part]]) {
                        let toAdd: number = Math.min(designCountdown[parts[part]], (counts[part] > totalCount / parts.length ? 2 : 1))
                        designCountdown[parts[part]] -= toAdd;
                        for (let i = 0; i < toAdd; i++) {
                            result.unshift(parts[part] as CreepBodyPart);
                            partsAffected++;
                        }
                    }
            } while(partsAffected > 0)
        }
        return result;
    }
}
