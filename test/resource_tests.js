// load Unit.js module
var test = require('unit.js');
var resource = require('../bots/blue/resource_test.js');

var map1 = [[false,false,false],[true,false,false],[false,false,false]];
var map2 =   [[true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,false,false,false,true,true,true],
              [true,true,false,false,false,true,true,true],
              [true,true,false,false,false,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true]]; 

/** Testing resource.get_resource_nodes */
var result1 = resource.get_resource_nodes(map1);
test.assert(result1.length === 1);
test.assert(result1[0].x === 0);
test.assert(result1[0].y === 1);

var result2 = resource.get_resource_nodes(map2);
test.assert(result2.length === 55);
test.assert(result2[17].x === 1);
test.assert(result2[17].y === 2);
test.assert(result2[18].x !== 2);

/**Testing resource.find_nearest_node */
var curr_loc = {'x': 2, 'y': 3};
var result3 = resource.find_nearest_node(curr_loc, result2);

