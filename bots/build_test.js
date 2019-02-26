//To check if any robots are present adjacent to castle.
exports.find_if_robot_is_present = function(loc,list){

    for (var i = 0; i < list.length; i++) {
        if (list[i].x === loc[0] && list[i].y === loc[1]){
            return false;
        }
    }
    return true;
}

//Inputs - castle location, map, and list of visible robots
//To find the possible adjancent locations around the castle to build required units.
exports.find_location_to_build_unit = function(castleLoc,map,list){

    var loc;
    if (map[castleLoc.y][castleLoc.x + 1] === true && this.find_if_robot_is_present([castleLoc.x + 1,castleLoc.y],list) === true){
        loc = { 'x': 1, 'y': 0 }
        return loc;
    }
    else if (map[castleLoc.y + 1][castleLoc.x + 1] === true && this.find_if_robot_is_present([castleLoc.x + 1,castleLoc.y + 1],list) === true){
        loc = { 'x': 1, 'y': 1 }
        return loc;
    }
    else if (map[castleLoc.y + 1][castleLoc.x] === true && this.find_if_robot_is_present([castleLoc.x,castleLoc.y + 1],list) === true){
        loc = { 'x': 0, 'y': 1 }
        return loc;
    }
    else if (map[castleLoc.y + 1][castleLoc.x - 1] === true && this.find_if_robot_is_present([castleLoc.x - 1,castleLoc.y + 1],list) === true){
        loc = { 'x': -1, 'y': 1 }
        return loc;
    }
    else if (map[castleLoc.y][castleLoc.x - 1] === true && this.find_if_robot_is_present([castleLoc.x - 1,castleLoc.y],list) === true){
        loc = { 'x': -1, 'y': 0 }
        return loc;
    }
    else if (map[castleLoc.y - 1][castleLoc.x - 1] === true && this.find_if_robot_is_present([castleLoc.x - 1,castleLoc.y - 1],list) === true){
        loc = { 'x': -1, 'y': -1 }
        return loc;
    }
    else if (map[castleLoc.y - 1][castleLoc.x] === true && this.find_if_robot_is_present([castleLoc.x,castleLoc.y - 1],list) === true){
        loc = { 'x': 0, 'y': -1 }
        return loc;
    }
    else if (map[castleLoc.y - 1][castleLoc.x + 1] === true && this.find_if_robot_is_present([castleLoc.x + 1,castleLoc.y - 1],list) === true){
        loc = { 'x': 1, 'y': -1 }
        return loc;
    }
}