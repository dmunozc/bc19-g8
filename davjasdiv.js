'use strict';

var SPECS = {"COMMUNICATION_BITS":16,"CASTLE_TALK_BITS":8,"MAX_ROUNDS":1000,"TRICKLE_FUEL":25,"INITIAL_KARBONITE":100,"INITIAL_FUEL":500,"MINE_FUEL_COST":1,"KARBONITE_YIELD":2,"FUEL_YIELD":10,"MAX_TRADE":1024,"MAX_BOARD_SIZE":64,"MAX_ID":4096,"CASTLE":0,"CHURCH":1,"PILGRIM":2,"CRUSADER":3,"PROPHET":4,"PREACHER":5,"RED":0,"BLUE":1,"CHESS_INITIAL":100,"CHESS_EXTRA":20,"TURN_MAX_TIME":200,"MAX_MEMORY":50000000,"UNITS":[{"CONSTRUCTION_KARBONITE":null,"CONSTRUCTION_FUEL":null,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":200,"VISION_RADIUS":100,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,64],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":50,"CONSTRUCTION_FUEL":200,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":100,"VISION_RADIUS":100,"ATTACK_DAMAGE":0,"ATTACK_RADIUS":0,"ATTACK_FUEL_COST":0,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":10,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":1,"STARTING_HP":10,"VISION_RADIUS":100,"ATTACK_DAMAGE":null,"ATTACK_RADIUS":null,"ATTACK_FUEL_COST":null,"DAMAGE_SPREAD":null},{"CONSTRUCTION_KARBONITE":15,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":9,"FUEL_PER_MOVE":1,"STARTING_HP":40,"VISION_RADIUS":49,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":25,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":2,"STARTING_HP":20,"VISION_RADIUS":64,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[16,64],"ATTACK_FUEL_COST":25,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":30,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":3,"STARTING_HP":60,"VISION_RADIUS":16,"ATTACK_DAMAGE":20,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":15,"DAMAGE_SPREAD":3}]};

function insulate(content) {
    return JSON.parse(JSON.stringify(content));
}

class BCAbstractRobot {
    constructor() {
        this._bc_reset_state();
    }

    // Hook called by runtime, sets state and calls turn.
    _do_turn(game_state) {
        this._bc_game_state = game_state;
        this.id = game_state.id;
        this.karbonite = game_state.karbonite;
        this.fuel = game_state.fuel;
        this.last_offer = game_state.last_offer;

        this.me = this.getRobot(this.id);

        if (this.me.turn === 1) {
            this.map = game_state.map;
            this.karbonite_map = game_state.karbonite_map;
            this.fuel_map = game_state.fuel_map;
        }

        try {
            var t = this.turn();
        } catch (e) {
            t = this._bc_error_action(e);
        }

        if (!t) t = this._bc_null_action();

        t.signal = this._bc_signal;
        t.signal_radius = this._bc_signal_radius;
        t.logs = this._bc_logs;
        t.castle_talk = this._bc_castle_talk;

        this._bc_reset_state();

        return t;
    }

    _bc_reset_state() {
        // Internal robot state representation
        this._bc_logs = [];
        this._bc_signal = 0;
        this._bc_signal_radius = 0;
        this._bc_game_state = null;
        this._bc_castle_talk = 0;
        this.me = null;
        this.id = null;
        this.fuel = null;
        this.karbonite = null;
        this.last_offer = null;
    }

    // Action template
    _bc_null_action() {
        return {
            'signal': this._bc_signal,
            'signal_radius': this._bc_signal_radius,
            'logs': this._bc_logs,
            'castle_talk': this._bc_castle_talk
        };
    }

    _bc_error_action(e) {
        var a = this._bc_null_action();
        
        if (e.stack) a.error = e.stack;
        else a.error = e.toString();

        return a;
    }

    _bc_action(action, properties) {
        var a = this._bc_null_action();
        if (properties) for (var key in properties) { a[key] = properties[key]; }
        a['action'] = action;
        return a;
    }

    _bc_check_on_map(x, y) {
        return x >= 0 && x < this._bc_game_state.shadow[0].length && y >= 0 && y < this._bc_game_state.shadow.length;
    }
    
    log(message) {
        this._bc_logs.push(JSON.stringify(message));
    }

    // Set signal value.
    signal(value, radius) {
        // Check if enough fuel to signal, and that valid value.
        
        var fuelNeeded = Math.ceil(Math.sqrt(radius));
        if (this.fuel < fuelNeeded) throw "Not enough fuel to signal given radius.";
        if (!Number.isInteger(value) || value < 0 || value >= Math.pow(2,SPECS.COMMUNICATION_BITS)) throw "Invalid signal, must be int within bit range.";
        if (radius > 2*Math.pow(SPECS.MAX_BOARD_SIZE-1,2)) throw "Signal radius is too big.";

        this._bc_signal = value;
        this._bc_signal_radius = radius;

        this.fuel -= fuelNeeded;
    }

    // Set castle talk value.
    castleTalk(value) {
        // Check if enough fuel to signal, and that valid value.

        if (!Number.isInteger(value) || value < 0 || value >= Math.pow(2,SPECS.CASTLE_TALK_BITS)) throw "Invalid castle talk, must be between 0 and 2^8.";

        this._bc_castle_talk = value;
    }

    proposeTrade(karbonite, fuel) {
        if (this.me.unit !== SPECS.CASTLE) throw "Only castles can trade.";
        if (!Number.isInteger(karbonite) || !Number.isInteger(fuel)) throw "Must propose integer valued trade."
        if (Math.abs(karbonite) >= SPECS.MAX_TRADE || Math.abs(fuel) >= SPECS.MAX_TRADE) throw "Cannot trade over " + SPECS.MAX_TRADE + " in a given turn.";

        return this._bc_action('trade', {
            trade_fuel: fuel,
            trade_karbonite: karbonite
        });
    }

    buildUnit(unit, dx, dy) {
        if (this.me.unit !== SPECS.PILGRIM && this.me.unit !== SPECS.CASTLE && this.me.unit !== SPECS.CHURCH) throw "This unit type cannot build.";
        if (this.me.unit === SPECS.PILGRIM && unit !== SPECS.CHURCH) throw "Pilgrims can only build churches.";
        if (this.me.unit !== SPECS.PILGRIM && unit === SPECS.CHURCH) throw "Only pilgrims can build churches.";
        
        if (!Number.isInteger(dx) || !Number.isInteger(dx) || dx < -1 || dy < -1 || dx > 1 || dy > 1) throw "Can only build in adjacent squares.";
        if (!this._bc_check_on_map(this.me.x+dx,this.me.y+dy)) throw "Can't build units off of map.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] > 0) throw "Cannot build on occupied tile.";
        if (!this.map[this.me.y+dy][this.me.x+dx]) throw "Cannot build onto impassable terrain.";
        if (this.karbonite < SPECS.UNITS[unit].CONSTRUCTION_KARBONITE || this.fuel < SPECS.UNITS[unit].CONSTRUCTION_FUEL) throw "Cannot afford to build specified unit.";

        return this._bc_action('build', {
            dx: dx, dy: dy,
            build_unit: unit
        });
    }

    move(dx, dy) {
        if (this.me.unit === SPECS.CASTLE || this.me.unit === SPECS.CHURCH) throw "Churches and Castles cannot move.";
        if (!this._bc_check_on_map(this.me.x+dx,this.me.y+dy)) throw "Can't move off of map.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] === -1) throw "Cannot move outside of vision range.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] !== 0) throw "Cannot move onto occupied tile.";
        if (!this.map[this.me.y+dy][this.me.x+dx]) throw "Cannot move onto impassable terrain.";

        var r = Math.pow(dx,2) + Math.pow(dy,2);  // Squared radius
        if (r > SPECS.UNITS[this.me.unit]['SPEED']) throw "Slow down, cowboy.  Tried to move faster than unit can.";
        if (this.fuel < r*SPECS.UNITS[this.me.unit]['FUEL_PER_MOVE']) throw "Not enough fuel to move at given speed.";

        return this._bc_action('move', {
            dx: dx, dy: dy
        });
    }

    mine() {
        if (this.me.unit !== SPECS.PILGRIM) throw "Only Pilgrims can mine.";
        if (this.fuel < SPECS.MINE_FUEL_COST) throw "Not enough fuel to mine.";
        
        if (this.karbonite_map[this.me.y][this.me.x]) {
            if (this.me.karbonite >= SPECS.UNITS[SPECS.PILGRIM].KARBONITE_CAPACITY) throw "Cannot mine, as at karbonite capacity.";
        } else if (this.fuel_map[this.me.y][this.me.x]) {
            if (this.me.fuel >= SPECS.UNITS[SPECS.PILGRIM].FUEL_CAPACITY) throw "Cannot mine, as at fuel capacity.";
        } else throw "Cannot mine square without fuel or karbonite.";

        return this._bc_action('mine');
    }

    give(dx, dy, karbonite, fuel) {
        if (dx > 1 || dx < -1 || dy > 1 || dy < -1 || (dx === 0 && dy === 0)) throw "Can only give to adjacent squares.";
        if (!this._bc_check_on_map(this.me.x+dx,this.me.y+dy)) throw "Can't give off of map.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] <= 0) throw "Cannot give to empty square.";
        if (karbonite < 0 || fuel < 0 || this.me.karbonite < karbonite || this.me.fuel < fuel) throw "Do not have specified amount to give.";

        return this._bc_action('give', {
            dx:dx, dy:dy,
            give_karbonite:karbonite,
            give_fuel:fuel
        });
    }

    attack(dx, dy) {
        if (this.me.unit === SPECS.CHURCH) throw "Churches cannot attack.";
        if (this.fuel < SPECS.UNITS[this.me.unit].ATTACK_FUEL_COST) throw "Not enough fuel to attack.";
        if (!this._bc_check_on_map(this.me.x+dx,this.me.y+dy)) throw "Can't attack off of map.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] === -1) throw "Cannot attack outside of vision range.";

        var r = Math.pow(dx,2) + Math.pow(dy,2);
        if (r > SPECS.UNITS[this.me.unit]['ATTACK_RADIUS'][1] || r < SPECS.UNITS[this.me.unit]['ATTACK_RADIUS'][0]) throw "Cannot attack outside of attack range.";

        return this._bc_action('attack', {
            dx:dx, dy:dy
        });
        
    }


    // Get robot of a given ID
    getRobot(id) {
        if (id <= 0) return null;
        for (var i=0; i<this._bc_game_state.visible.length; i++) {
            if (this._bc_game_state.visible[i].id === id) {
                return insulate(this._bc_game_state.visible[i]);
            }
        } return null;
    }

    // Check if a given robot is visible.
    isVisible(robot) {
        return ('unit' in robot);
    }

    // Check if a given robot is sending you radio.
    isRadioing(robot) {
        return robot.signal >= 0;
    }

    // Get map of visible robot IDs.
    getVisibleRobotMap() {
        return this._bc_game_state.shadow;
    }

    // Get boolean map of passable terrain.
    getPassableMap() {
        return this.map;
    }

    // Get boolean map of karbonite points.
    getKarboniteMap() {
        return this.karbonite_map;
    }

    // Get boolean map of impassable terrain.
    getFuelMap() {
        return this.fuel_map;
    }

    // Get a list of robots visible to you.
    getVisibleRobots() {
        return this._bc_game_state.visible;
    }

    turn() {
        return null;
    }
}

//array of possible 1 step movements from relative location
/**
 * Checks is an x,y coordinate is present in a list of x,y coordinates
 * @coor	list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @paths list A list of x,y coordinates list 
 * @returntrue if coor is in paths, false otherwise
 * Example:
 * @coor = [5,6]
 * @paths = [[0,0],[2,1],[10,15]]
 * @return = false
 */
function check_if_coor_in_path(coor,paths){
  var i;
  for(i = 0; i < paths.length;i++){
    if(coor[0] == paths[i][0] && coor[1] == paths[i][1]){
      return true;
    }
  }
  return false;
}
/**
 * Gives a list of x,y coordinate list that contains the relative locations that a unit can move to based on the map and its radius
 * @coor	list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @map list Map from battlecode
 * @radius int The radius of movement of the unit
 * @return	list A list of x,y coordinates list 
 * Example:
 * @coor = [5,6]
 * @map = Battlecode map, imagine everything is open
 * @radius = 2
 * @return = [[-2,0],[-1,-1],[-1,0],[-1,1],[0,-2],[0,-1],[0,1],[0,2],[1,-1],[1,0],[1,1],[2,0]]
 */
function get_possible_step_list(coor,map,radius){
  var i;
  var j;
  var k = 0;
  var result = [];
  for(i = -radius; i<=radius; i++){
    for(j = -radius; j<=radius; j++){
      if(get_distance([0,0],[i,j]) <= radius){
        if(!(coor[0] + i < 0 || coor[0] + i >= map.length || coor[1] + j < 0 || coor[1] + j >= map.length || (i == 0 && j == 0))){
          if(map[coor[1] + j][coor[0] + i] == true){
          result[k] = [i,j];
          k++;
          }
        }
      }
    }
  }
  return result;
}
/**
 * Gives a random member from a list
 * @list list of any objects
 * @return	random member of the given list
 * Example:
 * @list = [[1,6],[2,4],[6,2]]
 * @return = [6,2]
 */
function get_random_from_list(list){
  return list[Math.floor(Math.random() * (list.length) )];
}
/**
 * Given two coordinates it returns a two value list containing the direction to move
 * with respect to the first coordinate to the second coordinate
 * resulting list first value is:
 *    -1 if should move east
 *    1 if should move west
 *    0 if should stay in place
 * resulting list second value is:
 *    -1 if should move north
 *    1 if should move south
 *    0 if should stay in place
 * @coor1 list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @coor2 list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @return	list	A list that contains an x,y coordinate.
 * Example:
 * @coor1 = [2,2]
 * @coor2 = [4,4]
 * @return = [1,1]
 * Example:
 * @coor1 = [2,2]
 * @coor2 = [2,4]
 * @return = [0,1]
 * Example:
 * @coor1 = [4,4]
 * @coor2 = [2,4]
 * @return = [-1,0]
 */
function get_direction(coor1,coor2){
  var result = [0,0];//e-w,n-s,
  result[1] = (coor2[1] > coor1[1]) ? 1 : (coor2[1] < coor1[1]) ? -1 : 0;
  result[0] = (coor2[0] > coor1[0]) ? 1 : (coor2[0] < coor1[0]) ? -1 : 0;
  return result;
}
/**
 * Given a direction list (gotten from get_direction()), the movement radius, the battlecode map, and 
 * a current location, it returns the maximum optimum value that a unit can move in relative units
 * It takes care to not go out of bounds in map
 * @direction list	irection list (gotten from get_direction())
 * @radius int 
 * @map list Battlecode map
 * @currentLocation list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @return	list	A list that contains an x,y coordinate.
 * Example:
 * @direction = [0,1]
 * @radius = 3
 * @map = open map
 * @currentLocation = [9,9]
 * @return = [0,3]
 * Example:
 * @direction = [1,1]
 * @radius = 3
 * @map = open map
 * @currentLocation = [6,6]
 * @return = [2,2]
 */
function get_max_movement(direction,radius,map,currentLocation){
  var result = [0,0];
  var dx,dy;
  //TODO might break if dy and dx reach 0
  if(direction[0] == 0 || direction[1] == 0){
    if(direction[0] == 0){
      //
      dy = radius;
      while( (currentLocation[1] + (direction[1] * dy)) >= map.length){
        dy--;
      }
      result[1] = direction[1] * dy;
    }
    else if(direction[1] == 0){
      //
      dx = radius;
      while((currentLocation[0] + (direction[0] * dx)) >= map.length){
        dx--;
      }
      result[0] = direction[0] * dx;
    }
    return result;
  }
  dx = (radius-1);
  while(dx > 0 && (currentLocation[0] + (direction[0] * dx)) >= map.length){
    dx--;
  }
  dy = (radius-1);
  while(dy > 0 && ( currentLocation[1] + (direction[1] * dy)) >= map.length){
    dy--;
  }
  
  return [direction[0] * dx,direction[1] * dy];
  
}
/**
 * Gives distance between two points
 * @coor1 list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @coor2 list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @return double The calculated distance
 */
function get_distance(coor1,coor2){
  if(typeof coor1[1] === 'undefined' || typeof coor2[1] === 'undefined'){
    throw "get_distance vars not an array";
  }
  return Math.sqrt(Math.pow(coor1[0] - coor2[0],2) + Math.pow(coor1[1] - coor2[1],2));
}
/**
 * Given a current location coordinate, destination coordinate, a map, a list of previous visited coordinates, and the unit radus
 * It returns the greedy next step to take from the current location to reach the coordinate. Takes into account the unit radius,
 * unpassable tiles in map. 
 * It prevents an infite loop by checking against a list of previous visited coordinates, so it does not go back and forth the same place
 * You can also use the list of previous coordinates to add any coordinate you dont want to visit (as is a list of current occupied tiles by robots or buildings)
 * @currentLocation list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @destination list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @map list Battlecode map
 * @currentPath list A list of coordinate list
 * @radius int 
 * @return	list	A list that contains an x,y coordinate of the next step to make in absolute units
 * Example:
 * @currentLocation = [0,0]
 * @destination = [10,10]
 * @map = open map
 * @currentPath = []
 * @radius = 3 
 * @return = [2,2]
 * Example:
 * @currentLocation = [0,0]
 * @destination = [10,10]
 * @map = open map, unpassable tile at 2,2
 * @currentPath = []
 * @radius = 3 
 * @return = [3,0]  
 */
function get_next_step(currentLocation,destination,map,currentPath,radius){
  
  //r.log(currentLocation);
  //r.log(destination);
  if(get_distance(currentLocation,destination) < radius){
    return destination;
  }
  
  var direction = get_direction(currentLocation,destination);
  var maxMovement = get_max_movement(direction,radius,map,currentLocation);
  
  var openPaths;// = get_possible_steps(currentLocation,map);
  var newLocation = [currentLocation[0],currentLocation[1]];
  
  var moveAvailable = false;
  var i;
  if( (maxMovement[0] != 0 ||  maxMovement[1] != 0) && map[newLocation[1] + maxMovement[1]][newLocation[0] + maxMovement[0]] == true){
    newLocation[0] = newLocation[0] + maxMovement[0];
    newLocation[1] = newLocation[1] + maxMovement[1];
    moveAvailable = true;
  }
  for(i = maxMovement[0];i > 0 &&  !moveAvailable; i--){
    if( map[newLocation[1]][newLocation[0] + i] == true){
      newLocation[0] = newLocation[0] + i;
      break;
    }
  }
  for(i = maxMovement[1];i > 0 &&  !moveAvailable; i--){
    if( map[newLocation[1] + i][newLocation[0]] == true){
      newLocation[1] = newLocation[1] + i;
      break;
    }
  }
  if(!moveAvailable && (newLocation[0] != currentLocation[0] || newLocation[1] != currentLocation[1])){
    moveAvailable = true;
  }
  
  if(moveAvailable == true){
    if(!check_if_coor_in_path(newLocation,currentPath)){//this option does not allow backtracking
      return newLocation;
    }
    newLocation = [currentLocation[0],currentLocation[1]];
  }
  openPaths = get_possible_step_list(currentLocation,map,radius);
  //else if could not move, need to figure out where to move to continue.
  //this could break if enter into tunnel
  //return random open path
  var newPath = get_random_from_list(openPaths);
  //console.log(check_if_coor_in_path(newPath,currentPath));
  //console.log([newLocation[0] + newPath[0],newLocation[1] + newPath[1]]);
  //console.log(check_if_coor_in_path([newLocation[0] + newPath[0],newLocation[1] + newPath[1]],currentPath));
  while(check_if_coor_in_path([newLocation[0] + newPath[0],newLocation[1] + newPath[1]],currentPath)){ //this option does not allow backtracking
    newPath = get_random_from_list(openPaths);
  }
  
  return [newLocation[0] + newPath[0],newLocation[1] + newPath[1]];
}

/**
 * Given the object of visible robots (from the main helper function getVisibleRobots()) it returns a 
 * list of x,y coordinate list of their locations.
 * @visible object The visible robots object from the helper function
 * @return	list	A list of x,y coordinates with the locations of the robots
 */
function get_visible_robots_list(visible){
  var res = [];
  for (var i = 0; i < visible.length; i++){
    res.push([visible[i].x,visible[i].y]);
  }
  return res;
}
function get_possible_square_steps_list(coor,map){
  var i;
  var j;
  var k = 0;
  var result = [];
  for(i = -1; i<=1; i++){
    for(j = -1; j<=1; j++){
      if(!(coor[0] + i < 0 || coor[0] + i >= map.length || coor[1] + j < 0 || coor[1] + j >= map.length || (i == 0 && j == 0))){
        if(map[coor[1] + j][coor[0] + i] == true){
        result[k] = [i,j];
        k++;
        }
      }
    }
  }
  return result;
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
function get_resource_nodes(map){
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
function find_nearest_node(loc,list){
    var min_dist = 10000000;
    var index;
    for (var i = 0; i < list.length; i++) {
        var dist = get_distance([loc.x, loc.y], [list[i].x, list[i].y]);
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
function update_nodes(loc,list,visible){
    for (var i = 0; i < list.length; i++){
        var dist = get_distance([loc.x, loc.y], [list[i].x, list[i].y]);
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
function find_nearest_unoccupied_node(loc,list){
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
function find_nearest_unit(loc,list,type){
    var min_dist = 100000000;
    var res = {'x':loc.x, 'y':loc.y};
    var index;
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++){
            if (list[i].unit === type) {
//                var dist = (Math.abs(list[i].x - loc.x)) + (Math.abs(list[i].y - loc.y));
                var dist = get_distance([loc.x, loc.y], [list[i].x, list[i].y]);
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
function get_axis_of_symmetry(resourceMap){
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
function find_possible_castle_locations(origin,map,resourceMap){
  var result = [];
  var symm = get_axis_of_symmetry(resourceMap);
  if(symm == 1){
    result = [(map.length - 1 - origin[0]),origin[1]];
  }else if(symm == 0){
    result = [origin[0],(map.length - 1 - origin[1])];
  }
  return result;
}

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
function get_visible_enemies(team, list) {
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
function get_relative_position(curr, dest) {
    var res = { 'x': 0, 'y': 0 };
    res.x = dest.x - curr.x;
    res.y = dest.y - curr.y;
    return res;
}

const pilgrim = {};
var typePil;

pilgrim.takeTurn = (self) => {
  
  var curr_loc = {'x': self.me.x, 'y':self.me.y};
  var visible = self.getVisibleRobots();
  if(typeof typePil === 'undefined'){
    if (visible.filter(robot => robot.team === self.me.team && robot.unit === SPECS.PILGRIM).length > 1){
      typePil = 1;
    }else{
      typePil = 0;
    }
  }
  var karbonite = get_resource_nodes(self.getKarboniteMap());
  var fuel = get_resource_nodes(self.getFuelMap());
  var resources = karbonite.concat(fuel);
  karbonite = update_nodes(curr_loc, resources, visible);
  
  if(typePil == 1){
    self.signal(666, 25);
    var nearest_karb = find_nearest_unoccupied_node(curr_loc, resources);
  
    if (self.me.fuel !== 100){
      if (curr_loc.x ===  nearest_karb.x && curr_loc.y === nearest_karb.y) {
             //self.log("I am mining fuel!");
              //self.log("I am carrying " + self.me.fuel + " fuel, and " + self.me.karbonite);
              return self.mine();
      }
      var nexStep = get_next_step([self.me.x,self.me.y],[nearest_karb.x,nearest_karb.y],self.map,get_visible_robots_list(visible),2);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      //self.log("location : " + self.me.x + "," +self.me.y);
      //self.log("movement : " + movex + ";" + movey);
      return self.move(movex,movey);
    }else{
      //self.log("I am full! Looking for nearest castle...");
      var nearest_castle = find_nearest_unit(curr_loc, visible, 0);
      //self.log("Nearest castle is at (" + nearest_castle.x + ", " + nearest_castle.y +")");
      var dist = get_distance([self.me.x,self.me.y],[nearest_castle.x,nearest_castle.y]);
      if(dist <= Math.sqrt(2)){
        //self.log("I am unloading resources");
        var dx = nearest_castle.x - curr_loc.x;
        var dy = nearest_castle.y - curr_loc.y;
        return self.give(dx, dy, self.me.karbonite, self.me.fuel);
      }
      var nexStep = get_next_step([self.me.x,self.me.y],[nearest_castle.x,nearest_castle.y],self.map,get_visible_robots_list(visible),2);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      //self.log("location : " + self.me.x + "," +self.me.y);
      //self.log("movement : " + movex + ";" + movey);
      return self.move(movex,movey);
    }
    
  }else if(typePil == 0){
    self.signal(6969, 25);
    var nearest_karb = find_nearest_unoccupied_node(curr_loc, resources);
  
    if (self.me.karbonite !== 20){
      if (curr_loc.x ===  nearest_karb.x && curr_loc.y === nearest_karb.y) {
            //  self.log("I am mining karb!");
              //self.log("I am carrying " + self.me.fuel + " fuel, and " + self.me.karbonite);
              return self.mine();
      }
      var nexStep = get_next_step([self.me.x,self.me.y],[nearest_karb.x,nearest_karb.y],self.map,get_visible_robots_list(visible),2);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      //self.log("location : " + self.me.x + "," +self.me.y);
      //self.log("movement : " + movex + ";" + movey);
      return self.move(movex,movey);
    }else{
      //self.log("I am full! Looking for nearest castle...");
      var nearest_castle = find_nearest_unit(curr_loc, visible, 0);
      //self.log("Nearest castle is at (" + nearest_castle.x + ", " + nearest_castle.y +")");
      var dist = get_distance([self.me.x,self.me.y],[nearest_castle.x,nearest_castle.y]);
      if(dist <= Math.sqrt(2)){
        //self.log("I am unloading resources");
        var dx = nearest_castle.x - curr_loc.x;
        var dy = nearest_castle.y - curr_loc.y;
        return self.give(dx, dy, self.me.karbonite, self.me.fuel);
      }
      var nexStep = get_next_step([self.me.x,self.me.y],[nearest_castle.x,nearest_castle.y],self.map,get_visible_robots_list(visible),2);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      //self.log("location : " + self.me.x + "," +self.me.y);
      //self.log("movement : " + movex + ";" + movey);
      return self.move(movex,movey);
    }
  }
};

const castle = {};
castle.takeTurn = (self) => {
  var possibleSteps = get_possible_square_steps_list([self.me.x, self.me.y],self.map);
  //self.log("lala");
  //self.log(possibleSteps);
  var buildPlace = get_random_from_list(possibleSteps);
  var messagingRobots = self.getVisibleRobots().filter(robot => {
      if (robot.signal == 666 || robot.signal == 6969){
        return robot;
        
      }
      return;
  });
  //self.log("msg");
  //self.log(messagingRobots);

  //self.log(buildPlace);
  if(self.step== 0 || messagingRobots.length < 2){
   self.log("Building a pilgrim at " + (self.me.x+1) + ", " + (self.me.y+1));
   
        return self.buildUnit(SPECS.PILGRIM, buildPlace[0], buildPlace[1]);
  }
  
    if (self.step%6   === 1) {
        //self.log("Building a crusader at " + (self.me.x+1) + ", " + (self.me.y+1));
        return self.buildUnit(Math.floor(Math.random() * (4 - 4 + 1) ) + 4, buildPlace[0], buildPlace[1]);
    }  else {
        var visible = self.getVisibleRobots();
        var enemies = get_visible_enemies(self.me.team, visible);
        var curr_loc = {'x': self.me.x, 'y':self.me.y};
        if (enemies.length !== 0){
          //self.log("We see an enemy!");
            var target = find_nearest_node(curr_loc, enemies);
            //Check if in range
            var dist = get_distance([curr_loc.x,curr_loc.y], [target.x,target.y]);
            if (dist <= 8){
                //self.log("Attacking enemy!");
                var attack = get_relative_position(curr_loc, target);
                return self.attack(attack.x, attack.y);      
            }                    
        }
    }
  
};

const prophet = {};
var stepCounter$2 = 0;
var currentPath$2 = [];
var castlePaths$2;

prophet.takeTurn = (self) => {

 if(self.step === 0){
            //i know on creation I will be x+1,y+1 away from castle as per code below
            ////self.log(self.fuel_map);
            castlePaths$2 =  find_possible_castle_locations([self.me.x-1,self.me.y-1],self.map,self.fuel_map);
            //self.log(["me at: " + self.me.x,self.me.y]);
            //self.log("castle paths: ");
           //self.log(castlePaths);
           ////self.log(self.map);
            //path = movement.find_path_to_coordinate([self.me.x-1,self.me.y-1],castlePaths,self.map,self.me);
            ////self.log("chosen path: " );
            ////self.log(path);
            stepCounter$2 = 0;
            ////self.log(path);
          }
            // //self.log("Crusader health: " + self.me.health);
            //const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            //const choice = choices[Math.floor(Math.random()*choices.length)]
            var visible = self.getVisibleRobots();
            var enemies = get_visible_enemies(self.me.team, visible);
            var curr_loc = {'x': self.me.x, 'y':self.me.y};
            if (enemies.length !== 0){
              //self.log("We see an enemy!");
                var target = find_nearest_node(curr_loc, enemies);
                //Check if in range
                var dist = get_distance([curr_loc.x,curr_loc.y], [target.x,target.y]);
                if (dist <= 16 && dist >= 4){
                    //self.log("Attacking enemy!");
                    var attack = get_relative_position(curr_loc, target);
                    return self.attack(attack.x, attack.y);      
                }                    
            }
            if(self.step < 6 ||visible.length > 8){
              
            
              currentPath$2[stepCounter$2] = [self.me.x,self.me.y];
              if(stepCounter$2 == 0){
                stepCounter$2++;
                if(Math.abs(castlePaths$2[0] - self.me.x) == 1){
                  return self.move(-1,0);
                }
                if(Math.abs(castlePaths$2[1] - self.me.y) == 1){
                  return self.move(0,-1);
                }
                
              }
              ////self.log("me : " + self.me.x + "," +self.me.y);
              ////self.log("cP " + castlePaths);
              var nexStep = get_next_step([self.me.x,self.me.y],castlePaths$2,self.map,currentPath$2.concat(get_visible_robots_list(visible)),2);
              var movex = nexStep[0] - self.me.x;
              var movey = nexStep[1] - self.me.y;
              //self.log("stepCounter : " + stepCounter);
              //self.log("location : " + self.me.x + "," +self.me.y);
              //self.log("movement : " + movex + ";" + movey);
              stepCounter$2++;
              return self.move(movex,movey);
            }
           /*if(stepCounter < path.length){
              var movex = path[stepCounter][0] - self.me.x;
              var movey =  path[stepCounter][1] - self.me.y;
              
              //self.log("stepCounter : " + stepCounter);
              //self.log("location : " + [self.me.x,self.me.y]);
              //self.log("movement : " + movex + ";" + movey);
              stepCounter++;
              return self.move(movex,movey);
            }else{
              return
            }*/
            return;
            //return self.move(path[stepCounter][1],);
};

class MyRobot extends BCAbstractRobot {
  
  constructor() {
      super();
      this.step = -1;
  }
    turn() {
        //step++;
        this.step++;
        
       
        if (this.me.unit === SPECS.PROPHET) {
          return prophet.takeTurn(this);
        }else if (this.me.unit === SPECS.CASTLE) {
          //this.myType = castle;
          return castle.takeTurn(this);
        }else if (this.me.unit === SPECS.PILGRIM) {
          return pilgrim.takeTurn(this);
          
        }

    }
}

var robot = new MyRobot();

var robot = new MyRobot();
