// noinspection JSUnresolvedFunction
toStr = (arr) => arr.map(obj => (typeof obj) === 'object' ? obj.toHexString() : obj);

const flattenObject = object => {
    return Object.assign({}, ...function _flattenObject(objectBit, path = '') { //spread the result into our return object
        return [].concat(                                                       //concat everything into one level
            ...Object.keys(objectBit).map(                                      //iterate over object
                key => typeof objectBit[key] === 'object' ?                     //check if there is a nested object
                    _flattenObject(objectBit[key], `${ path }/${ key }`) :      //call itself if there is
                    ({[`${ path }/${ key }`]: objectBit[key]})                  //append object with it’s path as key
            )
        )
    }(object));
};

pluck = (arr, key) => arr.map(obj => obj[key]);

flatten = arr => arr.reduce((flat, next) => flat.concat(next), []);

without = (arr, ...args) => {
    for (let a of args) {
        let index = arr.indexOf(a);
        arr.splice(index, 1);
    }
};

unique = arr => arr.filter((elem, pos, arr1) => arr1.indexOf(elem) === pos);

//this difference function is different that other functions here as it returns the result instead of storing it in the parameters provided.
difference = (arr1, arr2) => {
    let temp = [];
    for (let i in arr1) {
        if (!arr2.includes(arr1[i])) temp.push(arr1[i]);
    }
    for (let i in arr2) {
        if (!arr1.includes(arr2[i])) temp.push(arr2[i]);
    }
    temp.sort((a, b) => a - b);
    return temp;
};

findWhere = (obj, field, data) => obj[field].toHexString() === data;

intersection = (arr1, arr2) => {

};

module.exports = {
    without: without,
    flatten: flatten,
    pluck: pluck,
    unique: unique,
    difference: difference,
    toStr: toStr,
    findWhere: findWhere,
    flattenObject: flattenObject
};