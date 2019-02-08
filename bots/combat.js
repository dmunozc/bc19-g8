/**
 * Searches through a list of visible units and
 * returns a list of visible enemies.
 * 
 * example usage: 
 *  var enemies = combat.get_visible_enemies(this.me.team, visible);
 * 
 * @param {int} team    int value of team 
 * @param {object} list list of visible robot objects
 * 
 * @returns {list}     list of robot objects    
 */
export function get_visible_enemies(team, list) {
    var res = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].team !== team) {
            res.push(list[i]);
        }
    }
    return res;
}

/**
 * Finds the dx and dy between two positions
 * 
 * example usage:
 *  var attack = combat.get_relative_position(curr_loc, target);
 * 
 * @param {object} curr object with x and y values
 * @param {object} dest object with x and y values
 * 
 * @returns {object}     object with x and y values
 */
export function get_relative_position(curr, dest) {
    var res = { 'x': 0, 'y': 0 };
    res.x = dest.x - curr.x;
    res.y = dest.y - curr.y;
    return res;
}