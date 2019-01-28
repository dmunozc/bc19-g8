// import {BCAbstractRobot, SPECS} from 'battlecode';

// Reads a 2D grid map and returns a list of x, y coordinates for any
// place on the map that outputs "true"
exports.get_resource_nodes = function(map){

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
exports.find_nearest_node = function(loc,list){

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
exports.calculate_distance = function(curr,dest){

    var dx = Math.abs(dest.x - curr.x);
    var dy = Math.abs(dest.y - curr.y);
    var dist = dx + dy;
    if (dx === 1 && dy === 1){
        dist = 1;
    }
    return dist;
}

// Finds the nearest unit of specified type
exports.find_nearest_unit = function(loc,list,type){

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

// Returns the dx, dy to from source to a dest coordinate
exports.calculate_move = function(curr,dest){

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