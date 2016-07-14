import { Log } from "../../utils/log";
import { Config } from "../../config/config";
import { CreepFactoryConfig } from "../../config/creepFactoryConfig";
import { CreepFactoryComponent, CreepFactoryPrototype } from "./index";

export namespace CreepFactory {

    let recipes: {[role: number /* CreepRole */]: CreepFactoryComponent[]} = {};
    let partOrders: {[part: string /* CreepBodyPart */ ]: number} = {
        move: 0,
        work: 0,
        carry: 0,
        attack: 0,
        ranged_attack: 0,
        tough: 0,
        heal: 0,
        claim: 0
    };


    export function addRecipe(role: CreepRole, recipe: CreepFactoryComponent[]) {
        recipes[role] = recipe;
    }


    export function setPartOrder(part: CreepBodyPart, priority: number) {
        partOrders[part] = priority;
    }


    export function designBlueprint(role: CreepRole, desiredCost: number): CreepBodyPart[] {
        if (!recipes[role])
            return undefined;

        let prototype: CreepFactoryPrototype = new CreepFactoryPrototype(recipes[role], desiredCost);

        if (!prototype.createRoughDesign()) {
            Log.debug("could not design a cheap enough blueprint", {file: "creep/factory", role: CreepRole[role], desiredCost: desiredCost});
            return undefined;
        }

        while (prototype.currentCost > desiredCost || prototype.totalParts > MAX_CREEP_SIZE)
            if (!prototype.tryRemovePart()) {
                Log.debug("could not design a cheap enough blueprint", {file: "creep/factory", role: CreepRole[role], desiredCost: desiredCost});
                return undefined;
            }

        while (prototype.totalParts < MAX_CREEP_SIZE && prototype.currentCost != desiredCost)
            if (!prototype.tryAddPart())
                break;

        while (prototype.totalParts < MAX_CREEP_SIZE)
            if (!prototype.tryEnforceRatio())
                break;

        if (!prototype.checkRatioValidity()) {
            Log.debug("could not design a cheap enough blueprint", {file: "creep/factory", role: CreepRole[role], desiredCost: desiredCost});
            return undefined;
        }

        let blueprint = prototype.assembleBluePrint(partOrders);

        Log.debug(CreepRole[role] + " design blueprint finalized for cost " + prototype.currentCost
                  + " (desired cost " + desiredCost + ")", prototype.design);
        Log.debug(CreepRole[role] + ": " + JSON.stringify(blueprint).toUpperCase());

        return blueprint;
    }

}
