import * as movement from './movement.js'

/** Reads a 2D grid map and returns a list of x, y coordinates for any
 *  place on the map that outputs "true" */
export function get_resource_nodes(map){
    var list = []
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map[0].length; j++){
            if (map[i][j] === true){
                list.push({'x':j, 'y':i, 'dist': 0, 'free': true});
            }
        }
    }
    return list;
}


/** Returns the item on the list that is closest to the provided
 *  location. */ 
export function find_nearest_node(loc,list){
    var min_dist = 10000000;
    var index;
    for (var i = 0; i < list.length; i++) {
        var dist = movement.get_distance([loc.x, loc.y], [list[i].x, list[i].y]);
        if (dist < min_dist) {
            min_dist = dist;
            index = i;
        }  
    }
    return list[index];
}
/** adds distance to node and checks to see if visible units occupy
 *  those nodes */
export function update_nodes(loc,list,visible){
    for (var i = 0; i < list.length; i++){
        var dist = movement.get_distance([loc.x, loc.y], [list[i].x, list[i].y]);
        list[i].dist = dist;
        for (var j = 0; j < visible.length; j++){
            if (visible[j].x === list[i].x && visible[j].y === list[i].y){
                list[i].free = false;
            }
        }
    }
    return list.sort((a, b) => a.dist - b.dist);
}


/** Returns the item on a sorted list of
 *  location objects to return closest location object
 *  that is not occupied */
export function find_nearest_unoccupied_node(loc,list){
    var index = 100000;
    for (var i = 0; i < list.length; i++){
        if (list[i].x === loc.x && list[i].y === loc.y || list[i].free){
            index = i;
            break;
        }
    }
    return list[index];
}

/** Finds the nearest unit of specified type */
export function find_nearest_unit(loc,list,type){
    var min_dist = 100000000;
    var res = {'x':loc.x, 'y':loc.y};
    var index;
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++){
            if (list[i].unit === type) {
                var dist = (Math.abs(list[i].x - loc.x)) + (Math.abs(list[i].y - loc.y));
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
/** DEPRECATED */
// Returns the dx, dy to from source to a dest coordinate
// export function calculate_move(curr,dest){
//     // example
//     // source: 35, 35
//     // dest: 24, 36
    
//     var dx = dest.x - curr.x;
//     var dy = dest.y - curr.y;

//     var res = {'x': 0, 'y': 0};

<<<<<<< Updated upstream
    // We need to move 2 on the x axis
    if (Math.abs(dx) > 0 && dy === 0) {
        res.x = (dx/Math.abs(dx)) * 2;
    }
    // We need to move 2 on the y axis
    if (dx === 0 && Math.abs(dy) > 1) {
        res.y = (dy/Math.abs(dy)) * 2;
    }
    // Else we'll move 1 on x and 1 on y;
    if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {
        res.x = (dx/Math.abs(dx));
        res.y = (dy/Math.abs(dy));
    }
    return res;
=======
//     // We need to move 2 on the x axis
//     if (Math.abs(dx) > 0 && dy === 0) {
//         res.x = (dx/Math.abs(dx)) * 2;
//     }
//     // We need to move 2 on the y axis
//     if (dx === 0 && Math.abs(dy) > 1) {
//         res.y = (dy/Math.abs(dy)) * 2;
//     }
//     // Else we'll move 1 on x and 1 on y;
//     if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {
//         res.x = (dx/Math.abs(dx));
//         res.y = (dy/Math.abs(dy));
//     }
//     return res;
// }

/** Checks for maps axis of symmetry
 *  return 0 for x axis (up and down symmetry)
 *  returns 1 for y axis (left and right symmetry) */
export function get_axis_of_symmetry(resourceMap){
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

export function find_possible_castle_locations(origin,map,resourceMap){
  var result = [];
  var symm = get_axis_of_symmetry(resourceMap);
  if(symm == 1){
    result = [(map.length - 1 - origin[0]),origin[1]];
  }else if(symm == 0){
    result = [origin[0],(map.length - 1 - origin[1])];
  }
  return result;
>>>>>>> Stashed changes
}