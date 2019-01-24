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
        var dist = (Math.abs(list[i].x - loc.x)) + (Math.abs(list[i].y - loc.y));
        if (dist < min_dist) {
            min_dist = dist;
            index = i;
        }
        
    }
    return list[index];
}

// Calculates the distance between two locations
export function calculate_distance(curr, dest) {
    var dx = Math.abs(dest.x - curr.x);
    var dy = Math.abs(dest.y - curr.y);
    var dist = dx + dy;
    if (dx === 1 && dy === 1){
        dist = 1;
    }
    return dist;
}

// Finds the nearest unit of specified type
export function find_nearest_unit(loc, list, type) {
    var min_dist = 100000000;
    var res = {'x':0, 'y':0};
    var index;
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


export function find_possible_castle_locations(origin,map,r){
  var result = [];
  var i = 0;
  var count = 0;
  var temp;
  for(i = 0; i < 2; i++){
    if(i == 0){
      temp = [(map.length - 1 - origin[0]),origin[1]];
    }else if (i == 1){
      temp = [origin[0],(map.length - 1 - origin[1])];
    }
    //r.log(temp);
    //r.log(i);
    if(map[temp[1]][temp[0]] == true){
      result[count] = [temp[0],temp[1]];
      count++;
    }
  }
  //r.log(result);
  return result;
}