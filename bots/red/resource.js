import {BCAbstractRobot, SPECS} from 'battlecode';






// Reads a 2D grid map and returns a list of x, y coordinates for any
// place on the map that outputs "true"
export function get_resource_nodes(map) {
    var list = []
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map[0].length; j++){
            if (map[i][j] === true){
                list.push({x:j, y:i});
            }
        }
    }
    return list;
} 

// Returns the item on the list that is closest to the provided
// location. 
export function find_nearest_node(loc, list) {
    var min_dist = 10000000;
    var index;
    for (var i = 0; i < list.length; i++) {
        var dist = get_distance([list[i].x, list[i].y],[loc.x, loc.y]);//(Math.abs(list[i].x - loc.x)) + (Math.abs(list[i].y - loc.y));
        if (dist < min_dist) {
            min_dist = dist;
            index = i;
        }
        
    }
    return list[index];
}
export function get_distance(coor1,coor2){
  return Math.sqrt(Math.pow(coor1[0] - coor2[0],2) + Math.pow(coor1[1] - coor2[1],2));
}
// Calculates the distance between two locations
export function calculate_distance(curr, dest) {
  
  return get_distance([curr.x,curr.y],[dest.x,dest.y]);
  /*  var dx = Math.abs(dest.x - curr.x);
    var dy = Math.abs(dest.y - curr.y);
    var dist = dx + dy;
    if (dx === 1 && dy === 1){
        dist = 1;
    }
    return dist;*/
}

// Finds the nearest unit of specified type
export function find_nearest_unit(loc, list, type) {
    var min_dist = 100000000;
    var res = {'x':0, 'y':0};
    var index;
    for (var i = 0; i < list.length; i++){
        if (list[i].unit === type) {
            var dist = get_distance([list[i].x, list[i].y],[loc.x, loc.y]);//(Math.abs(list[i].x - loc.x)) + (Math.abs(list[i].y - loc.y));
            if (dist < min_dist) {
                min_dist = dist;
                index = i;
            }
        }
    }
    res.x = list[index].x;
    res.y = list[index].y;
    return res;
}

// Updates the map of impassable terrain with current positions
// export function update_map(loc, map, castle){
//     var map_loc = map[loc.y][loc.x];
//     if (castle) {
//         map[loc.y][loc.x] = "@@@@@@@@@@@@@@@@@@@@@@CASTLE@@@@@@@@@@@@@@@@@@@@";
//     }
//     else {
//         if (map_loc !== false) {
//             map_loc = false
//         }
//     }
//     // for (var i = 0; i < map.length; i++){
//     //     for (var j = 0; j< map[0].length; j++){
//     //         map[i][j] = "CASTLE";
//     //     }
//     // }
//     return map;
// }

// Returns the dx, dy to from source to a dest coordinate
export function calculate_move(curr, dest) {
    // example
    // source: 35, 35
    // dest: 24, 36
    
    var dx = dest.x - curr.x;
    var dy = dest.y - curr.y;

    var res = {'x': 0, 'y': 0};

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
}

//Checks for maps axis of symmetry
//return 0 for x axis (up and down symmetry)
//returns 1 for y axis (left and right symmetry)
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
}