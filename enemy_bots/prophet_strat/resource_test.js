
/**
 * This function is used to find nearby nodes for the castle so that it knows
 * how many pilgrims to make
 * 
 * @requires resource.update_nodes();
 * 
 * example usage:
 *  var nearby_nodes = resource.find_nearby_nodes(curr_loc, resources, visbile, 10);
 * 
 * @param {object} loc  current location of castle, object with x and y properties 
 * @param {list}  list  list of resources (fuel and/or karb)
 * @param {list}  visible   list of visible units (used for dependant function)
 * @param {int}   range   the vision range
 * 
 * @returns {list}  returns a list of nodes in the vision range
 */
exports.find_nearby_nodes = function(loc,list,visible,range){

  var nearby_nodes = [];
  var nodes = this.update_nodes(loc,list,visible);
  for (var i = 0; i < nodes.length; i++){
    if (nodes[i].dist <= range){
      nearby_nodes.push(nodes[i]);
    }
  }
  return nearby_nodes;
}

/**
 * This function is used to see how many pilgrims are in vision range.
 * Used by castle to update pilgrim counts.
 * 
 * @param {list} visible  list of visible units
 * @param {int} unit  number of unit to retrieve
 * 
 * @returns {int} returns a count of unit
 */
exports.get_number_of_units = function(visible,unit){
  var count = 0;
  for (var i = 0; i < visible.length; i++){
    if (visible[i].unit === unit){
      count++;
    }
  }
  return count;
}

/**
 * Takes a 2D map grid and returns a list of objects with
 * x and y coordinates wherever the map has true.
 * 
 * example usage:
 *  var karbonite = resource.get_resource_nodes(this.getKarboniteMap());
 * 
 * @param {boolean} map   a 2D array of booleans
 * 
 * @returns {list}    a list of objects with x and y coordinates, dist and free
 *                      properties.
 */
exports.get_resource_nodes = function(map){

    var list = [];
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map[0].length; j++){
            if (map[i][j] === true){
                list.push({'x':j, 'y':i, 'dist': 0, 'free': true});
            }
        }
    }
    return list;
}


/**
 * Returns an item on a list that is closest to provided
 * location.
 * 
 * @requires    movement.get_distance()
 * 
 * example usage:
 *  var nearest_karb = resource.find_nearest_unoccupied_node(curr_loc, resources);
 * 
 * @param {object} loc  a object with x and y coordinates 
 * @param {list} list   a list of objects with x and y coordinates, dist and free
 *                          properties.
 * 
 * @returns {object}    an object with x and y coordinates, dist and free properties.
 */
exports.find_nearest_node = function(loc,list){

    var min_dist = 10000000;
    var index;
    for (var i = 0; i < list.length; i++) {
        var dist = this.get_distance([loc.x, loc.y], [list[i].x, list[i].y]);
        if (dist < min_dist) {
            min_dist = dist;
            index = i;
        }  
    }
    return list[index];
}
/**
 * Adds distance to each dist property on the list and updates the free property
 * 
 * example usage:
 *  var karbonite = resource.update_nodes(curr_loc, resources, visible);
 * 
 * @param {object} loc   an object with x and y coordinates 
 * @param {list} list  a list of objects with x, y, dist, and free properties
 * @param {list} visible   a list of robot objects
 * 
 * @returns {list}  a list of objects with x, y, dist, and free properties sorted by dist
 *                   from the loc x and y coordinates(closest will be first)
 */
exports.update_nodes = function(loc,list,visible){

    for (var i = 0; i < list.length; i++){
        var dist = this.get_distance([loc.x, loc.y], [list[i].x, list[i].y]);
        list[i].dist = dist;
        for (var j = 0; j < visible.length; j++){
            if (visible[j].x === list[i].x && visible[j].y === list[i].y){
                list[i].free = false;
            }
        }
    }
    return list.sort((a, b) => a.dist - b.dist);
}


/**
 * Finds the nearest unoccupied coordinate from supplied location
 * Requires a call to update_nodes first.
 * 
 * example usage:
 *  var karbonite = resource.update_nodes(curr_loc, resources, visible);
 *  var nearest_karb = resource.find_nearest_unoccupied_node(curr_loc, resources);
 * 
 * @param {object} loc  an object with x and y coordinates 
 * @param {list} list   a sorted list of objects with x, y, dist, and free properties, 
 *                      sorted by closest dist to loc first.
 * 
 * @returns {object}    an object with x, y, dist, and free properties closest to the
 *                          loc provided (may also be the same location unit is on if
 *                          it is on a resource node)
 */
exports.find_nearest_unoccupied_node = function(loc,list){

    var index = 100000;
    for (var i = 0; i < list.length; i++){
        if (list[i].x === loc.x && list[i].y === loc.y || list[i].free){
            index = i;
            break;
        }
    }
    return list[index];
}

/**
 * Finds nearest unit of specified type.
 * 
 * @requires movement.get_distance()
 * 
 * example usage:
 *  var nearest_castle = resource.find_nearest_unit(curr_loc, visible, 0);
 * 
 * @param {object} loc  object with x and y properties 
 * @param {list} list   a list of visible robot objects 
 * @param {int} type    integer representing unit type (0 for castle, 1 for church...)
 * 
 * @returns {object}    object with x and y properties.
 */
exports.find_nearest_unit = function(loc,list,type){

    var min_dist = 100000000;
    var res = {'x':loc.x, 'y':loc.y};
    var index;
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++){
            if (list[i].unit === type) {
//                var dist = (Math.abs(list[i].x - loc.x)) + (Math.abs(list[i].y - loc.y));
                var dist = this.get_distance([loc.x, loc.y], [list[i].x, list[i].y]);
                if (dist < min_dist) {
                    min_dist = dist;
                    index = i;
                }
            }
        }
        res.x = list[index].x;
        res.y = list[index].y;
    }
    return res;
}

/**
 * Checks map for axis of symmetry
 * 
 * example usage:
 *  var axis = get_axis_of_symmetry(this.getKarboniteMap());
 * 
 * @param {boolean} resourceMap a 2d grid of booleans
 * 
 * @returns {int}   0 for x axis (up and down symmetry), 1 for y axis 
 *                      (left and right symmetry), -1 on error.
 */
exports.get_axis_of_symmetry = function(resourceMap){

  var i;
  var j;
  var resourceCoordinates = [-1,-1];
  for(i =0; i < resourceMap.length; i++){
    for(j =0; j < resourceMap.length; j++){
      if(resourceMap[j][i] == true){
        resourceCoordinates[0] = i;
        resourceCoordinates[1] = j;
        break;
      }
    }
    if(j < resourceMap.length && i < resourceMap.length && resourceMap[j][i] == true){
      break;
    }
  }
  var resourceYSymm =  [(resourceMap.length - 1 - resourceCoordinates[0]),resourceCoordinates[1]];
  var resourceXSymm = [resourceCoordinates[0],(resourceMap.length - 1 - resourceCoordinates[1])];
  if(resourceMap[resourceYSymm[1]][resourceYSymm[0]] == true){
    return 1;
  }
  if(resourceMap[resourceXSymm[1]][resourceXSymm[0]] == true){
    return 0;
  }
  return -1;
}

/**
 * Finds possible castle locations
 * 
 * @requires get_axis_of_symmetry();
 * 
 * example usage:
 *  var castlePaths = resource.find_possible_castle_locations([this.me.x - 1, 
 *                      this.me.y - 1], this.map, this.fuel_map);
 * 
 * @param {list} origin a list of 2 ints, where list[0] = x, and list[1] = y 
 * @param {boolean} map a 2d array of booleans
 * @param {boolean} resourceMap a 2d array of booleans
 * 
 * @returns {list}  castle location where list[0] = x coord, and list[1] = y coord 
 */
exports.find_possible_castle_locations = function(origin,map,resourceMap){

  var result = [];
  var symm = get_axis_of_symmetry(resourceMap);
  if(symm == 1){
    result = [(map.length - 1 - origin[0]),origin[1]];
  }else if(symm == 0){
    result = [origin[0],(map.length - 1 - origin[1])];
  }
  return result;
}
exports.get_distance = function(coor1,coor2){
  return Math.sqrt(Math.pow(coor1[0] - coor2[0],2) + Math.pow(coor1[1] - coor2[1],2));
}