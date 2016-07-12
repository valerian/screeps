export function invertObjectStringNumber(object: {[key: string]: number}): {[key: number]: string[]}  {
    let result: {[key: number]: string[]} = {}
    for (let i in object) {
        if (!result[object[i]])
            result[object[i]] = [];
        result[object[i]].push(i);
    }
    return result;
}

export function cleanMemory()
{
    for (let key in ['creeps', 'spawns', 'rooms', 'flags'])
        for (let i in Memory[key])
            if(!(Game as { [name: string]: any })[key][i])
                delete Memory[key][i];
}
