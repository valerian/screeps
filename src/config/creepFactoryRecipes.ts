import { CreepRole } from '../declarations/declarations';
import { CreepFactory } from '../creep/factory';
import { Bootstrapper } from '../bootstrapper';

export namespace CreepFactoryRecipes {

    function init() {
        CreepFactory.addRecipe(CreepRole.Miner, [
            new CreepFactory.CreepFactoryComponent('work', 99).setMinimum(1).setMaximum(5),
            new CreepFactory.CreepFactoryComponent('move', 1).setMinimum(1).setMaximum(3)
        ]);
        CreepFactory.addRecipe(CreepRole.MinerLink, [
            new CreepFactory.CreepFactoryComponent('work', 98).setMinimum(1).setMaximum(5),
            new CreepFactory.CreepFactoryComponent('carry', 1).setMinimum(1).setMaximum(1),
            new CreepFactory.CreepFactoryComponent('move', 1).setMinimum(1).setMaximum(3)
        ]);
        CreepFactory.addRecipe(CreepRole.Prospector, [
            new CreepFactory.CreepFactoryComponent('work', 50).setMinimum(1).setMaximum(5),
            new CreepFactory.CreepFactoryComponent('move', 50).setMinimum(1).setMaximum(5).enforceRatio()
        ]);
        CreepFactory.addRecipe(CreepRole.Transporter, [
            new CreepFactory.CreepFactoryComponent('carry', 2/3).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('move', 1/3).setMinimum(1).enforceRatio()
        ]);        
        CreepFactory.addRecipe(CreepRole.Hauler, [
            new CreepFactory.CreepFactoryComponent('carry', 50).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ]);        
        CreepFactory.addRecipe(CreepRole.Worker, [
            new CreepFactory.CreepFactoryComponent('work', 41).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('carry', 25).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('move', 33).setMinimum(1).enforceRatio()
        ]);        
        CreepFactory.addRecipe(CreepRole.Engineer, [
            new CreepFactory.CreepFactoryComponent('work', 30).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('carry', 20).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ]);        
        CreepFactory.addRecipe(CreepRole.Scout, [
            new CreepFactory.CreepFactoryComponent('move', 1).setMinimum(1).setMaximum(1),
        ]);        
        CreepFactory.addRecipe(CreepRole.Ram, [
            new CreepFactory.CreepFactoryComponent('tough', 20).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('work', 30).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ]);        
        CreepFactory.addRecipe(CreepRole.Soldier, [
            new CreepFactory.CreepFactoryComponent('tough', 20).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('attack', 15).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('ranged_attack', 15).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ]);        
        CreepFactory.addRecipe(CreepRole.Healer, [
            new CreepFactory.CreepFactoryComponent('tough', 20).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('heal', 30).setMinimum(1),
            new CreepFactory.CreepFactoryComponent('move', 50).setMinimum(1).enforceRatio()
        ]);        
    }
    Bootstrapper.registerBootstrapFunction(init);
}
