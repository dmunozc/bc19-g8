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

// ****TODO: Check that current unit is on visible list
var visible1 = [{x: 2, y: 3}, {x:1, y: 2}, {x:1, y:1}, {x:1, y:3}];

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
var nearest_node1 = resource.find_nearest_node({'x': 2, 'y': 3}, result2);
var nearest_node2 = resource.find_nearest_node({'x': 3, 'y': 2}, result2);
test.assert(nearest_node1.x === 1);
test.assert(nearest_node1.y === 3);
test.assert(nearest_node2.x === 3);
test.assert(nearest_node2.y === 1);

/**Testing resource.update_nodes */
var updated_list = resource.update_nodes({x: 1, y: 2}, result2, visible1);
// Check to see that first item of updated list is where current loc is.
test.assert(updated_list[0].x === 1);
test.assert(updated_list[0].y === 2);
// Check to see that the space is no longer free.
test.assert(result2[17].free === true);
test.assert(updated_list[0].free === false);
// Check to see that updated list is the same as the node list
test.assert(updated_list.length === result2.length);
// Check that the list is sorted by distance from current unit location
var length = updated_list.length;
var dist = resource.get_distance([1, 2], [result2[length-1].x, result2[length -1].y]);
test.assert(updated_list[length -1].dist === dist);
test.assert(updated_list[length -1].dist >= updated_list[length-2].dist);
test.assert(updated_list[length -1].dist >= updated_list[length-3].dist);


/**Testing resource.find_nearest_unoccupied_node */
var nearest_node1 = resource.find_nearest_unoccupied_node({x:1, y:2}, updated_list);
//Check to see if we're on a node
test.assert(nearest_node1.free === false);
test.assert(nearest_node1.x === 1);
test.assert(nearest_node1.y === 2);
// Check to see if there a near free node if we are not on it
var updated_list = resource.update_nodes({x:2, y:2}, result2, visible1);
var nearest_node2 = resource.find_nearest_unoccupied_node({x:2, y:2}, updated_list);
test.assert(nearest_node2.free === true);
test.assert(nearest_node2.x === 2);
test.assert(nearest_node2.y === 1);
