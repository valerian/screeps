import CreepFactoryComponent from "./creepFactoryComponent.ts";
import { invertObjectStringNumber } from "../../utils/helpers";

export default class CreepFactoryPrototype {
    protected isDesigned: boolean;
    protected desiredCost: number;
    protected recipe: CreepFactoryComponent[];
    protected averagePartCost: number;
    protected ratioSum: number;
    protected _design: {[part: string]: number};
    protected _currentCost: number | undefined;
    protected _totalParts: number | undefined;

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

        for (let i: number = 0; i < this.recipe.length; i++) {
            this.ratioSum += recipe[i].ratioWeight;
            this.averagePartCost += recipe[i].ratioWeight * recipe[i].cost;
        }
        this.averagePartCost /= this.ratioSum;
    }

    public createRoughDesign(): boolean {
        if (this.desiredCost <= 0) {
            return false;
        }

        let limitingFactor = 1;
        if (this.desiredCost / this.averagePartCost > MAX_CREEP_SIZE) {
            limitingFactor = MAX_CREEP_SIZE / (this.desiredCost / this.averagePartCost);
        }
        for (let i: number = 0; i < this.recipe.length; i++) {
            let portion = Math.floor((this.recipe[i].ratioWeight / this.ratioSum) *
                                     (this.desiredCost / this.averagePartCost) *
                                     limitingFactor);
            if (this.recipe[i].minimum && portion < this.recipe[i].minimum) {
                portion = this.recipe[i].minimum;
            }
            if (this.recipe[i].maximum && portion > this.recipe[i].maximum) {
                portion = this.recipe[i].maximum;
            }
            this._design[this.recipe[i].part] = portion;
        }

        this.invalidateCache();

        if (this.totalParts === 0) {
            return false;
        }

        return true;
    }

    public tryRemovePart(): boolean {
        let highestRatioDeviationPart: string | undefined;
        let highestRatioDeviationScore: number | undefined;

        for (let i in this.recipe) {
            if (this._design[this.recipe[i].part] === 0 ||
                this.recipe[i].minimum && this._design[this.recipe[i].part] === this.recipe[i].minimum) {
                continue;
            }
            const currentRatio = this._design[this.recipe[i].part] / this.totalParts;
            const reducedRatio = (this._design[this.recipe[i].part] - 1) / (this.totalParts - 1);
            if (this.recipe[i].isRatioEnforced && reducedRatio < (this.recipe[i].ratioWeight / this.ratioSum)) {
                continue;
            }
            const currentRatioDeviation = currentRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            const reducedRatioDeviation = reducedRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            const ratioDeviationScore = currentRatioDeviation + reducedRatioDeviation;
            if (typeof highestRatioDeviationScore === undefined || ratioDeviationScore > highestRatioDeviationScore) {
                highestRatioDeviationPart = this.recipe[i].part;
                highestRatioDeviationScore = ratioDeviationScore;
            }
        }

        if (!highestRatioDeviationPart) {
            return false;
        }

        this._design[highestRatioDeviationPart]--;
        this.invalidateCache();

        if (this.totalParts === 0) {
            return false;
        }

        return true;
    }

    public tryAddPart(): boolean {
        let lowestRatioDeviationPart: string | undefined;
        let lowestRatioDeviationScore: number | undefined;

        for (let i: number = 0; i < this.recipe.length; i++) {
            if (this.recipe[i].isRatioEnforced &&
                (this._design[this.recipe[i].part] / (this.totalParts + 1))
                < (this.recipe[i].ratioWeight / this.ratioSum)) {
                if (this.recipe[i].cost + this.currentCost > this.desiredCost ||
                    this.recipe[i].maximum && this._design[this.recipe[i].part] === this.recipe[i].maximum) {
                    lowestRatioDeviationPart = undefined;
                } else {
                    lowestRatioDeviationPart = this.recipe[i].part;
                }
                break;
            }
            if (this.recipe[i].cost + this.currentCost > this.desiredCost ||
                this.recipe[i].maximum && this._design[this.recipe[i].part] === this.recipe[i].maximum) {
                continue;
            }
            const currentRatio = this._design[this.recipe[i].part] / this.totalParts;
            const increasedRatio = (this._design[this.recipe[i].part] + 1) / (this.totalParts + 1);
            const currentRatioDeviation = currentRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            const increasedRatioDeviation = increasedRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            const ratioDeviationScore = currentRatioDeviation + increasedRatioDeviation;
            if (typeof lowestRatioDeviationScore === "undefined" || ratioDeviationScore < lowestRatioDeviationScore) {
                lowestRatioDeviationPart = this.recipe[i].part;
                lowestRatioDeviationScore = ratioDeviationScore;
            }
        }

        if (typeof lowestRatioDeviationPart === "undefined") {
            return false;
        }

        this._design[lowestRatioDeviationPart]++;
        this.invalidateCache();

        return true;
    }

    public tryEnforceRatio(): boolean {
        let highestDeviationEnforcablePart: string | undefined;
        let highestDeviationEnforcableScore: number | undefined;

        for (let i: number = 0; i < this.recipe.length; i++) {
            if (!this.recipe[i].isRatioEnforced ||
                this._design[this.recipe[i].part] === 0 ||
                this.recipe[i].minimum && this._design[this.recipe[i].part] === this.recipe[i].minimum) {
                continue;
            }
            const currentRatio = this._design[this.recipe[i].part] / this.totalParts;
            const reducedRatio = (this._design[this.recipe[i].part] - 1) / (this.totalParts - 1);
            const reducedOtherRatio = this._design[this.recipe[i].part] / (this.totalParts - 1);
            if (reducedOtherRatio < (this.recipe[i].ratioWeight / this.ratioSum)) {
                if (reducedRatio < (this.recipe[i].ratioWeight / this.ratioSum)) {
                    highestDeviationEnforcablePart = undefined;
                } else {
                    highestDeviationEnforcablePart = this.recipe[i].part;
                }
                break;
            }
            if (reducedRatio < (this.recipe[i].ratioWeight / this.ratioSum)) {
                continue;
            }
            const currentRatioDeviation = currentRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            const reducedRatioDeviation = reducedRatio - (this.recipe[i].ratioWeight / this.ratioSum);
            const ratioDeviationScore = currentRatioDeviation + reducedRatioDeviation;
            if (typeof highestDeviationEnforcableScore === "undefined"
                || ratioDeviationScore > highestDeviationEnforcableScore) {
                highestDeviationEnforcablePart = this.recipe[i].part;
                highestDeviationEnforcableScore = ratioDeviationScore;
            }
        }

        if (typeof highestDeviationEnforcablePart === "undefined") {
            return false;
        }

        this._design[highestDeviationEnforcablePart]--;
        this.invalidateCache();

        return true;
    }

    public checkRatioValidity(): boolean {
        for (let i: number = 0; i < this.recipe.length; i++) {
            if (this.recipe[i].isRatioEnforced &&
                (this._design[this.recipe[i].part] / this.totalParts) < (this.recipe[i].ratioWeight / this.ratioSum)) {
                return false;
            }
        }
        return true;
    }

    public assembleBluePrint(partOrders: {[part: string /* CreepBodyPart */ ]: number}): CreepBodyPart[] {
        const invertPartOrders: {[priority: number]: string[]} = invertObjectStringNumber(partOrders);
        const priorities: number[] = _.uniq(_.values(partOrders)).sort() as number[];
        const result: CreepBodyPart[] = [];
        const designCountdown: { [part: string]: number } = _.clone(this.design);

        for (let priority: number = 0; priority < priorities.length; priority++) {
            let partsAffected: number;
            do {
                partsAffected = 0;
                const parts: string[] = invertPartOrders[priorities[priority]];
                const counts: { [part: string]: number } = {};
                let totalCount: number = 0;
                for (let part: number = 0; part < parts.length; part++) {
                    totalCount += designCountdown[parts[part]];
                    counts[part] = designCountdown[parts[part]];
                }
                for (let part in parts) {
                    if (designCountdown[parts[part]]) {
                        const toAdd: number = Math.min(designCountdown[parts[part]],
                                                     (counts[part] > totalCount / parts.length ? 2 : 1));
                        designCountdown[parts[part]] -= toAdd;
                        for (let i = 0; i < toAdd; i++) {
                            result.unshift(parts[part] as CreepBodyPart);
                            partsAffected++;
                        }
                    }
                }
            } while (partsAffected > 0);
        }
        return result;
    }

    protected invalidateCache() {
        this._currentCost = undefined;
        this._totalParts = undefined;
    }
}
