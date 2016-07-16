import { CreepFactoryComponent } from "../components/creepFactory/index";
import * as CreepFactory from "../components/creepFactory/index";
import * as Broadcaster from "../broadcaster";
import { CreepRole } from "../typings/enums";

Broadcaster.init.subscribe(() => {

    // higher number = more in front of the creep

    CreepFactory.setPartOrder("move", -5);
    CreepFactory.setPartOrder("work", 10);
    CreepFactory.setPartOrder("carry", 0);
    CreepFactory.setPartOrder("attack", -5);
    CreepFactory.setPartOrder("ranged_attack", -5);
    CreepFactory.setPartOrder("tough", 20);
    CreepFactory.setPartOrder("heal", -10);
    CreepFactory.setPartOrder("claim", 0);

    CreepFactory.addRecipe(CreepRole.Miner, [
        new CreepFactoryComponent("work", 99).setMinimum(1).setMaximum(5),
        new CreepFactoryComponent("move", 1).setMinimum(1).setMaximum(3),
    ]);
    CreepFactory.addRecipe(CreepRole.MinerLink, [
        new CreepFactoryComponent("work", 98).setMinimum(1).setMaximum(5),
        new CreepFactoryComponent("carry", 1).setMinimum(1).setMaximum(1),
        new CreepFactoryComponent("move", 1).setMinimum(1).setMaximum(3),
    ]);
    CreepFactory.addRecipe(CreepRole.Prospector, [
        new CreepFactoryComponent("work", 50).setMinimum(1).setMaximum(5),
        new CreepFactoryComponent("move", 50).setMinimum(1).setMaximum(5).enforceRatio(),
    ]);
    CreepFactory.addRecipe(CreepRole.Transporter, [
        new CreepFactoryComponent("carry", 2 / 3).setMinimum(1),
        new CreepFactoryComponent("move", 1 / 3).setMinimum(1).enforceRatio(),
    ]);
    CreepFactory.addRecipe(CreepRole.Hauler, [
        new CreepFactoryComponent("carry", 50).setMinimum(1),
        new CreepFactoryComponent("move", 50).setMinimum(1).enforceRatio(),
    ]);
    CreepFactory.addRecipe(CreepRole.Worker, [
        new CreepFactoryComponent("work", 41).setMinimum(1),
        new CreepFactoryComponent("carry", 25).setMinimum(1),
        new CreepFactoryComponent("move", 33).setMinimum(1).enforceRatio(),
    ]);
    CreepFactory.addRecipe(CreepRole.Engineer, [
        new CreepFactoryComponent("work", 30).setMinimum(1),
        new CreepFactoryComponent("carry", 20).setMinimum(1),
        new CreepFactoryComponent("move", 50).setMinimum(1).enforceRatio(),
    ]);
    CreepFactory.addRecipe(CreepRole.Scout, [
        new CreepFactoryComponent("move", 1).setMinimum(1).setMaximum(1),
    ]);
    CreepFactory.addRecipe(CreepRole.Ram, [
        new CreepFactoryComponent("tough", 20).setMinimum(1),
        new CreepFactoryComponent("work", 30).setMinimum(1),
        new CreepFactoryComponent("move", 50).setMinimum(1).enforceRatio(),
    ]);
    CreepFactory.addRecipe(CreepRole.Soldier, [
        new CreepFactoryComponent("tough", 20).setMinimum(1),
        new CreepFactoryComponent("attack", 15).setMinimum(1),
        new CreepFactoryComponent("ranged_attack", 15).setMinimum(1),
        new CreepFactoryComponent("move", 50).setMinimum(1).enforceRatio(),
    ]);
    CreepFactory.addRecipe(CreepRole.Healer, [
        new CreepFactoryComponent("tough", 20).setMinimum(1),
        new CreepFactoryComponent("heal", 30).setMinimum(1),
        new CreepFactoryComponent("move", 50).setMinimum(1).enforceRatio(),
    ]);
});
