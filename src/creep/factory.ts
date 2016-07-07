import { Log } from '../utils/log'
import { Config } from '../config/config'
import { CreepRole } from '../declarations/declarations';

class CreepFactoryComponent {
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

export class CreepFactory {
    public recipes: {[role: number]: CreepFactoryComponent[]};

    constructor() {
        this.recipes = {};
        this.recipes[CreepRole.Miner] = [
            new CreepFactoryComponent('work', 99).setMinimum(1).setMaximum(5),
            new CreepFactoryComponent('move', 1).setMinimum(1).setMaximum(3)
        ];
        this.recipes[CreepRole.MinerLink] = [
            new CreepFactoryComponent('work', 98).setMinimum(1).setMaximum(5),
            new CreepFactoryComponent('carry', 1).setMinimum(1).setMaximum(1),
            new CreepFactoryComponent('move', 1).setMinimum(1).setMaximum(3)
        ];
        this.recipes[CreepRole.Prospector] = [
            new CreepFactoryComponent('work', 50).setMinimum(1).setMaximum(5),
            new CreepFactoryComponent('move', 50).setMinimum(1).setMaximum(5).enforceRatio()
        ];
        this.recipes[CreepRole.Transporter] = [
            new CreepFactoryComponent('carry', 2/3).setMinimum(1),
            new CreepFactoryComponent('move', 1/3).setMinimum(1).enforceRatio()
        ];        
        this.recipes[CreepRole.Hauler] = [
            new CreepFactoryComponent('carry', 50).setMinimum(1),
            new CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ];        
        this.recipes[CreepRole.Worker] = [
            new CreepFactoryComponent('work', 41).setMinimum(1),
            new CreepFactoryComponent('carry', 25).setMinimum(1),
            new CreepFactoryComponent('move', 33).setMinimum(1).enforceRatio()
        ];        
        this.recipes[CreepRole.Engineer] = [
            new CreepFactoryComponent('work', 30).setMinimum(1),
            new CreepFactoryComponent('carry', 20).setMinimum(1),
            new CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ];        
        this.recipes[CreepRole.Scout] = [
            new CreepFactoryComponent('move', 1).setMinimum(1).setMaximum(1),
        ];        
        this.recipes[CreepRole.Ram] = [
            new CreepFactoryComponent('tough', 20).setMinimum(1),
            new CreepFactoryComponent('work', 30).setMinimum(1),
            new CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ];        
        this.recipes[CreepRole.Soldier] = [
            new CreepFactoryComponent('tough', 20).setMinimum(1),
            new CreepFactoryComponent('attack', 15).setMinimum(1),
            new CreepFactoryComponent('ranged_attack', 15).setMinimum(1),
            new CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ];        
        this.recipes[CreepRole.Healer] = [
            new CreepFactoryComponent('tough', 20).setMinimum(1),
            new CreepFactoryComponent('heal', 30).setMinimum(1),
            new CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ];        
    }

    public designBlueprint(role: CreepRole, desiredCost: number): CreepBodyPart[] {
        let recipe: CreepFactoryComponent[] = this.recipes[role];
        let design: {[part: string]: number} = {};
        let cost: number = 0;
        let ratioSum: number = 0;
        let currentCost = 0;
        let totalParts = 0;
        let averagePartCost = 0;

        if (desiredCost < 50)
            return undefined;
        
        for (let i in recipe) {
            ratioSum += recipe[i].ratioWeight;
            averagePartCost += recipe[i].ratioWeight * recipe[i].cost;
        }
        averagePartCost /= ratioSum;

        // base rough design
        
        for (let i in recipe) {
            let portion = Math.floor((recipe[i].ratioWeight / ratioSum) * (desiredCost / averagePartCost));
            if (recipe[i].minimum && portion < recipe[i].minimum)
                portion = recipe[i].minimum;
            if (recipe[i].maximum && portion > recipe[i].maximum)
                portion = recipe[i].maximum;
            design[recipe[i].part] = portion;
        }

        currentCost = _.sum(recipe, (r) => r.cost * design[r.part]);
        Log.trace(CreepRole[role] + ' design blueprint rough for cost ' + currentCost + ' (desired cost ' + desiredCost + ')', design);

        // trim extra parts if design too expensive
        
        currentCost = _.sum(recipe, (r) => r.cost * design[r.part]);
        totalParts = _.sum(design);

        while (currentCost > desiredCost) {
            let highestRatioDeviationPart: string;
            let highestRatioDeviationScore: number;
            
            for (let i in recipe) {
                if (design[recipe[i].part] == 0 || recipe[i].minimum && design[recipe[i].part] == recipe[i].minimum)
                    continue;
                let currentRatio = design[recipe[i].part] / totalParts;
                let reducedRatio = (design[recipe[i].part] - 1) / (totalParts - 1);
                if (recipe[i].isRatioEnforced && reducedRatio < (recipe[i].ratioWeight / ratioSum))
                    continue;
                let currentRatioDeviation = currentRatio - (recipe[i].ratioWeight / ratioSum);
                let reducedRatioDeviation = reducedRatio - (recipe[i].ratioWeight / ratioSum);
                let ratioDeviationScore = currentRatioDeviation + reducedRatioDeviation;
                if (typeof highestRatioDeviationScore == undefined || ratioDeviationScore > highestRatioDeviationScore) {
                    highestRatioDeviationPart = recipe[i].part;
                    highestRatioDeviationScore = ratioDeviationScore;
                }
            }

            if (!highestRatioDeviationPart) {
                Log.debug('could not design a cheap enough blueprint', {file: 'creep/factory', role: CreepRole[role], desiredCost: desiredCost});
                return undefined;
            }
            
            design[highestRatioDeviationPart]--;
            currentCost = _.sum(recipe, (r) => r.cost * design[r.part]);    
        }

        Log.trace(CreepRole[role] + ' design blueprint cheapened for cost ' + currentCost + ' (desired cost ' + desiredCost + ')', design);

        // try to fill design if cost not reached

        for (let iteration = 0; iteration < Config.creepFactoryRefineIterations && currentCost != desiredCost; iteration++) {
            let lowestRatioDeviationPart: string;
            let lowestRatioDeviationScore: number;

            for (let i in recipe) {
                if (recipe[i].isRatioEnforced &&
                    (design[recipe[i].part] / (totalParts + 1)) < (recipe[i].ratioWeight / ratioSum)) {
                    if (recipe[i].cost + currentCost > desiredCost ||
                        recipe[i].maximum && design[recipe[i].part] == recipe[i].maximum)
                        lowestRatioDeviationPart = undefined;
                    else
                        lowestRatioDeviationPart = recipe[i].part;
                    break;
                }
                if (recipe[i].cost + currentCost > desiredCost ||
                    recipe[i].maximum && design[recipe[i].part] == recipe[i].maximum)
                    continue;
                let currentRatio = design[recipe[i].part] / totalParts;
                let increasedRatio = (design[recipe[i].part] + 1) / (totalParts + 1);
                let currentRatioDeviation = currentRatio - (recipe[i].ratioWeight / ratioSum);
                let increasedRatioDeviation = increasedRatio - (recipe[i].ratioWeight / ratioSum);
                let ratioDeviationScore = currentRatioDeviation + increasedRatioDeviation;
                if (typeof lowestRatioDeviationScore === 'undefined' || ratioDeviationScore < lowestRatioDeviationScore) {
                    lowestRatioDeviationPart = recipe[i].part;
                    lowestRatioDeviationScore = ratioDeviationScore;
                }
                
            }
            
            if (typeof lowestRatioDeviationPart === 'undefined')
                break;
            design[lowestRatioDeviationPart]++;
            totalParts = _.sum(design);
            currentCost = _.sum(recipe, (r) => r.cost * design[r.part]);
        }

        Log.trace(CreepRole[role] + ' design blueprint filled for cost ' + currentCost + ' (desired cost ' + desiredCost + ')', design);

        // try to reduce design cost again based on if enforced ratio parts can be successfully reduced

        for (let iteration = 0; iteration < Config.creepFactoryRefineIterations; iteration++) {
            let highestDeviationEnforcablePart: string;
            let highestDeviationEnforcableScore: number;
            
            for (let i in recipe) {
                if (!recipe[i].isRatioEnforced ||
                    design[recipe[i].part] == 0 ||
                    recipe[i].minimum && design[recipe[i].part] == recipe[i].minimum)
                    continue;
                let currentRatio = design[recipe[i].part] / totalParts;
                let reducedRatio = (design[recipe[i].part] - 1) / (totalParts - 1);
                let reducedOtherRatio = design[recipe[i].part] / (totalParts - 1);
                if (reducedOtherRatio < (recipe[i].ratioWeight / ratioSum)) {
                    if (reducedRatio < (recipe[i].ratioWeight / ratioSum))
                        highestDeviationEnforcablePart = undefined;
                    else
                        highestDeviationEnforcablePart = recipe[i].part;
                    break;
                }
                if (reducedRatio < (recipe[i].ratioWeight / ratioSum)) {
                    continue;
                }
                let currentRatioDeviation = currentRatio - (recipe[i].ratioWeight / ratioSum);
                let reducedRatioDeviation = reducedRatio - (recipe[i].ratioWeight / ratioSum);
                let ratioDeviationScore = currentRatioDeviation + reducedRatioDeviation;
                if (typeof highestDeviationEnforcableScore === 'undefined' || ratioDeviationScore > highestDeviationEnforcableScore) {
                    highestDeviationEnforcablePart = recipe[i].part;
                    highestDeviationEnforcableScore = ratioDeviationScore;
                }
            }

            if (typeof highestDeviationEnforcablePart === 'undefined')
                break;
            
            design[highestDeviationEnforcablePart]--;
            totalParts = _.sum(design);
            currentCost = _.sum(recipe, (r) => r.cost * design[r.part]);    
        }

        
        Log.debug(CreepRole[role] + ' design blueprint finalized for cost ' + currentCost + ' (desired cost ' + desiredCost + ')', design);

        //TODO a proper parts orderer
        
        let result: CreepBodyPart[] = [];
        for (let part in design)
            for (let i = 0; i < design[part]; i++)
                result.push(part as CreepBodyPart);

        Log.debug(CreepRole[role] + ': ' + JSON.stringify(result).toUpperCase());
        
        return result;
    }
}

