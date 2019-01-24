// load Unit.js module
var test = require('unit.js');
var movement = require('../bots/red/movement_test.js');

var map1 = [[true,true,true],[true,true,true],[true,true,true]];

var result1 = movement.getDirection([0,0],[2,2]);
test.assert(result1[0] === 1);
test.assert(result1[1] === 1);

result1 = movement.getDirection([0,0],[0,0]);
test.assert(result1[0] === 0);
test.assert(result1[1] === 0);

result1 = movement.getDirection([2,2],[0,0]);
test.assert(result1[0] === -1);
test.assert(result1[1] === -1);

result1 = movement.getDirection([0,0],[0,2]);
test.assert(result1[0] === 0);
test.assert(result1[1] === 1);

result1 = movement.getDirection([0,0],[2,0]);
test.assert(result1[0] === 1);
test.assert(result1[1] === 0);

