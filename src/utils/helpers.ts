export function invertObjectStringNumber(object: {[key: string]: number}): {[key: number]: string[]}  {
    let result: {[key: number]: string[]} = {}
    for (let i in object) {
        if (!result[object[i]])
            result[object[i]] = [];
        result[object[i]].push(i);
    }
    return result;
}
