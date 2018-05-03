const tools = require('../tools');

test ('testing trendly for if ups and downs matter when dateCreated is Jan 1, 2015', () => {
    expect(tools.trendly(4, 5, 1420070400)).toBeFalsy();
});

test ('testing the pluck function', () => {
   let arr = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
    expect(tools.pluck(arr, 'name')).toEqual(["moe", "larry", "curly"]);
});

test ('should flatten nested arrays to return a single array with all nested array values', () => {
    expect(tools.flatten([1, [2], [3, [[4]]]])).toEqual([1, 2, 3, 4])
});

test ('should return the difference between the 2 arrays passed', () => {
    expect(tools.difference([1,2,3,4,5], [3,4,5,6,7])).toEqual([1,2,6,7])
});
