import {BCAbstractRobot, SPECS} from 'battlecode';

// Searches through all the visible robots and returns a 
// list of visible enemies.
export function get_visible_enemies(team, list) {
    var res = [];
    for (var i = 0; i < list.length; i++){
        if (list[i].team !== team){
            res.push(list[i]);
        }
    }
    return res;
}

// Input is x and y coordinates of source and destination.
// Returns the dx and dy
export function get_relative_position(curr, dest) {
    var res = {'x': 0, 'y': 0};
    res.x = dest.x - curr.x;
    res.y = dest.y - curr.y;
    return res;
}