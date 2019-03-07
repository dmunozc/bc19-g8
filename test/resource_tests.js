// load Unit.js module
var test = require('unit.js');
var resource = require('../bots/resource_test.js');
var movement = require('../bots/movement_test.js');




var map1 = [[false, false, false], [true, false, false], [false, false, false]];
var map2 = [[true, true, true, true, true, true, true, true],
[true, true, true, true, true, true, true, true],
[true, true, false, false, false, true, true, true],
[true, true, false, false, false, true, true, true],
[true, true, false, false, false, true, true, true],
[true, true, true, true, true, true, true, true],
[true, true, true, true, true, true, true, true],
[true, true, true, true, true, true, true, true]];
var map3 = [[true, true, false, false, false, false, true, true],
[true, true, false, false, false, false, true, true],
[true, false, false, false, false, false, false, false],
[false, false, false, true, false, false, false, false],
[false, false, true, true, false, false, false, false],
[false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, true, false],
[false, false, false, false, false, true, true, false]];
var map4 = [[true, false, false, false],
[false, false, false, false],
[false, false, false, false],
[false, false, false, true]];



var visible1 = [{ x: 2, y: 3, unit: 0 }, { x: 1, y: 2, unit: 1 }, { x: 1, y: 1, unit: 1 }, { x: 1, y: 3, unit: 2 }];
var resource_nodes1 = [{ x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 9, y: 5 }];
// Resources on map seed 773036575
var resource_nodes2 = [{ "x": 15, "y": 1, "dist": 0, "free": true }, { "x": 30, "y": 1, "dist": 0, "free": true }, { "x": 2, "y": 16, "dist": 0, "free": true }, { "x": 43, "y": 16, "dist": 0, "free": true }, { "x": 10, "y": 23, "dist": 0, "free": true }, { "x": 35, "y": 23, "dist": 0, "free": true }, { "x": 5, "y": 35, "dist": 0, "free": true }, { "x": 40, "y": 35, "dist": 0, "free": true }, { "x": 11, "y": 0, "dist": 0, "free": true }, { "x": 34, "y": 0, "dist": 0, "free": true }, { "x": 13, "y": 2, "dist": 0, "free": true }, { "x": 32, "y": 2, "dist": 0, "free": true }, { "x": 5, "y": 17, "dist": 0, "free": true }, { "x": 40, "y": 17, "dist": 0, "free": true }, { "x": 2, "y": 18, "dist": 0, "free": true }, { "x": 43, "y": 18, "dist": 0, "free": true }, { "x": 9, "y": 23, "dist": 0, "free": true }, { "x": 36, "y": 23, "dist": 0, "free": true }, { "x": 5, "y": 34, "dist": 0, "free": true }, { "x": 40, "y": 34, "dist": 0, "free": true }];
// Resources on map seed 1723414601
var resource_nodes3 = [{"x":14,"y":8,"dist":0,"free":true},{"x":35,"y":8,"dist":0,"free":true},{"x":3,"y":13,"dist":0,"free":true},{"x":46,"y":13,"dist":0,"free":true},{"x":6,"y":14,"dist":0,"free":true},{"x":43,"y":14,"dist":0,"free":true},{"x":2,"y":23,"dist":0,"free":true},{"x":47,"y":23,"dist":0,"free":true},{"x":1,"y":24,"dist":0,"free":true},{"x":48,"y":24,"dist":0,"free":true},{"x":7,"y":38,"dist":0,"free":true},{"x":42,"y":38,"dist":0,"free":true},{"x":19,"y":39,"dist":0,"free":true},{"x":30,"y":39,"dist":0,"free":true},{"x":18,"y":40,"dist":0,"free":true},{"x":31,"y":40,"dist":0,"free":true},{"x":13,"y":8,"dist":0,"free":true},{"x":36,"y":8,"dist":0,"free":true},{"x":5,"y":15,"dist":0,"free":true},{"x":44,"y":15,"dist":0,"free":true},{"x":0,"y":23,"dist":0,"free":true},{"x":49,"y":23,"dist":0,"free":true},{"x":2,"y":25,"dist":0,"free":true},{"x":47,"y":25,"dist":0,"free":true},{"x":18,"y":35,"dist":0,"free":true},{"x":31,"y":35,"dist":0,"free":true},{"x":5,"y":36,"dist":0,"free":true},{"x":44,"y":36,"dist":0,"free":true},{"x":18,"y":37,"dist":0,"free":true},{"x":31,"y":37,"dist":0,"free":true},{"x":19,"y":38,"dist":0,"free":true},{"x":30,"y":38,"dist":0,"free":true},{"x":5,"y":39,"dist":0,"free":true},{"x":44,"y":39,"dist":0,"free":true}]
var friendly_castles3 = [{"x":5,"y":38},{"x":4,"y":14}];
var enemy_castles3 = [{"x":44,"y":38,"dist":39},{"x":45,"y":14,"dist":46.647615158762406}];


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
var nearest_node1 = resource.find_nearest_node({ 'x': 2, 'y': 3 }, result2);
var nearest_node2 = resource.find_nearest_node({ 'x': 3, 'y': 2 }, result2);
test.assert(nearest_node1.x === 1);
test.assert(nearest_node1.y === 3);
test.assert(nearest_node2.x === 3);
test.assert(nearest_node2.y === 1);

/**Testing resource.update_nodes */
var updated_list = resource.update_nodes({ x: 1, y: 2 }, result2, visible1);
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
var dist = movement.get_distance([1, 2], [result2[length - 1].x, result2[length - 1].y]);
test.assert(updated_list[length - 1].dist === dist);
test.assert(updated_list[length - 1].dist >= updated_list[length - 2].dist);
test.assert(updated_list[length - 1].dist >= updated_list[length - 3].dist);


/**Testing resource.find_nearest_unoccupied_node */
var nearest_node1 = resource.find_nearest_unoccupied_node({ x: 1, y: 2 }, updated_list);
//Check to see if we're on a node
test.assert(nearest_node1.free === false);
test.assert(nearest_node1.x === 1);
test.assert(nearest_node1.y === 2);
// Check to see if there a near free node if we are not on it
var updated_list = resource.update_nodes({ x: 2, y: 2 }, result2, visible1);
var nearest_node2 = resource.find_nearest_unoccupied_node({ x: 2, y: 2 }, updated_list);
test.assert(nearest_node2.free === true);
test.assert(nearest_node2.x === 2);
test.assert(nearest_node2.y === 1);


/**Testing resource.find_nearby_nodes */
var nearby_nodes = resource.find_nearby_nodes({ x: 2, y: 3 }, resource_nodes1, visible1, 2);
test.assert(nearby_nodes.length === 3);
test.assert(nearby_nodes[0].dist <= 2);

/**Testing resource.get_number_of_units */
var unitCount1 = resource.get_number_of_units(visible1, 1);
var unitCount2 = resource.get_number_of_units(visible1, 2);
var unitCount3 = resource.get_number_of_units(visible1, 3);
test.assert(unitCount1 === 2);
test.assert(unitCount2 === 1);
test.assert(unitCount3 === 0);


/**Testing resource.find_clusters */

var cluster1 = resource.find_clusters(resource_nodes2, 0, 0);
test.assert(cluster1.length === 8);
var cluster2 = resource.find_clusters(resource_nodes3, 0, 0);
test.assert(cluster2.length === 10);
// When we add enemy and friendly castles, there are less nodes
var cluster3 = resource.find_clusters(resource_nodes3, friendly_castles3, enemy_castles3);
// console.log(cluster3);
test.assert(cluster3.length === 6);
// var updated1 = resource.update_nodes({x:0, y:0}, resources, []);
// console.log(updated1);