// noinspection JSUnresolvedFunction
const toStr = (arr) => arr.map(obj => (typeof obj) === 'object' ? obj.toHexString() : obj);

const log10 = function (val) {
    return Math.log(val) / Math.LN10;
};

const abs = function (val) {
    return Math.abs(val);
};

let max = function (val1, val2) {
    return Math.max(val1, val2);
};

let round = function (val) {
    return Math.round(val);
};

const trendly = function (ups, downs, dateCreated) {
    let s = difference(ups, downs);
    let order = log10(max(abs(s), 1));
    let sign;
    if (s > 0) sign = 1;
    else if (s < 0) sign = -1;
    else sign = 0;
    let seconds = dateCreated - 1420070400; // GMT: Thursday, January 1, 2015 12:00:00 AM
    return round(((order * sign + seconds / 45000) * 10000));
};

let getTimestampFromId = function (id) {
    // noinspection JSUnresolvedFunction
    return id.getTimestamp().getTime() / 1000;
};

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
    flattenObject: flattenObject,
    getTimestampFromId: getTimestampFromId,
    trendly: trendly
};