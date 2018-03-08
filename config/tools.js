const pluck = (arr, key) => arr.map(obj => obj[key]);

const flatten = arr => arr.reduce((flat, next) => flat.concat(next), []);

const without = (arr, ...args) => {
    for (let a of args) {
        let index = arr.indexOf(a);
        arr.splice(index, 1);
    }
};