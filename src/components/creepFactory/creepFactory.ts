import * as Log from "../../utils/log";
import CreepFactoryComponent from "./creepFactoryComponent";
import CreepFactoryPrototype from "./creepFactoryPrototype";
import { CreepRole } from "../../typings/enums";

let recipes: {[role: number /* CreepRole */]: CreepFactoryComponent[]} = {};
let partOrders: {[part: string /* CreepBodyPart */ ]: number} = {
    attack: 0,
    carry: 0,
    claim: 0,
    heal: 0,
    move: 0,
    ranged_attack: 0,
    tough: 0,
    work: 0,
};

export function addRecipe(role: CreepRole, recipe: CreepFactoryComponent[]) {
    recipes[role] = recipe;
}

export function setPartOrder(part: CreepBodyPart, priority: number) {
    partOrders[part] = priority;
}

export function designBlueprint(role: CreepRole, desiredCost: number): CreepBodyPart[] | undefined {
    if (!recipes[role]) {
        return undefined;
    }

    let prototype: CreepFactoryPrototype = new CreepFactoryPrototype(recipes[role], desiredCost);

    if (!prototype.createRoughDesign()) {
        Log.debug("could not design a cheap enough blueprint",
                  "CreepFactory.designBlueprint", { desiredCost: desiredCost, role: CreepRole[role] });
        return undefined;
    }

    while (prototype.currentCost > desiredCost || prototype.totalParts > MAX_CREEP_SIZE) {
        if (!prototype.tryRemovePart()) {
            Log.debug("could not design a cheap enough blueprint",
                      "CreepFactory.designBlueprint", { desiredCost: desiredCost, role: CreepRole[role] });
            return undefined;
        }
    }

    while (prototype.totalParts < MAX_CREEP_SIZE && prototype.currentCost !== desiredCost) {
        if (!prototype.tryAddPart()) {
            break;
        }
    }

    while (prototype.totalParts < MAX_CREEP_SIZE) {
        if (!prototype.tryEnforceRatio()) {
            break;
        }
    }

    if (!prototype.checkRatioValidity()) {
        Log.debug("could not design a cheap enough blueprint",
                  "CreepFactory.designBlueprint", { desiredCost: desiredCost, role: CreepRole[role] });
        return undefined;
    }

    let blueprint = prototype.assembleBluePrint(partOrders);

    Log.debug(CreepRole[role] + " design blueprint finalized for cost " + prototype.currentCost
              + " (desired cost " + desiredCost + ")", "CreepFactory.designBlueprint", prototype.design);
    Log.debug(CreepRole[role] + ": " + JSON.stringify(blueprint).toUpperCase(), "CreepFactory.designBlueprint");

    return blueprint;
}
