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
      if(typeof list[i].team === 'undefined' ){
        continue;
      }
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
 * Generates an array of relative x,y coordinates that a unit from its current location can move to 
 * @currentLocation list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @radius int 
 * @map list Battlecode map
 * @previousPathsTaken list A list of multiple x,y coordinates that contains the previous paths taken, can be empty
 * @return list possible coordinates a unit can move
 */
function generate_open_list(currentLocation,radius,map,previousPathsTaken){
  //this gives relative x,y location only based on map
  var openPaths = get_possible_step_list(currentLocation,map,radius);
  var i;
  for(i = 0; i < openPaths.length;i++){
    if(check_if_coor_in_path([openPaths[i][0] + currentLocation[0], openPaths[i][1] + currentLocation[1]], previousPathsTaken) == true){
      openPaths.splice(i,1);
      i--;
    }
  }
  return openPaths
}
/**
 * Generates a list with the same index position in openList denoting its g value
 * g value is the movement cost to move from the starting point to a given square on the grid, following the path generated to get there.
 * @openList list possible coordinates a unit can move
 * @return list of g values in same index as openList
 */
function calculate_open_list_g(openList,type){
  var i;
  var result = [];
  for(i = 0; i < openList.length;i++){
    if(type == 1){//fuel
    result.push(get_distance([0,0],openList[i]));
    }else{ //turn
      result.push(1.0);
    }
  }
  return result;
}

/**
 * Generates a list with the same index position in openList denoting its h value
 * h value the estimated movement cost to move from that given square on the grid to the final destination.
 * I am using euclidian distance, but could explore using diagonal distance for pilgrim
 * @currentLocation list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @destination list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @openList list possible coordinates a unit can move
 * @return list of h values in same index as openList
 */
function calculate_open_list_h(currentLocation,destination,openList){
  var i;
  var result = [];
  var potentialMove = [];
  for(i = 0; i < openList.length;i++){
    potentialMove[0] = openList[i][0] + currentLocation[0];
    potentialMove[1] = openList[i][1] + currentLocation[1];
    result.push(get_distance(potentialMove,destination));
  }
  return result;
}

function get_next_step_astar_fuel(currentLocation,destination,map,previousPathsTaken,radius){
  return get_next_step_astar(currentLocation,destination,map,previousPathsTaken,radius,1)
}

function get_next_step_astar_turn(currentLocation,destination,map,previousPathsTaken,radius){
  return get_next_step_astar(currentLocation,destination,map,previousPathsTaken,radius,0)
}

function get_next_step_astar(currentLocation,destination,map,previousPathsTaken,radius,type){
  if(get_distance(currentLocation,destination) < radius){
    return destination;
  }
  var openList = [];
  var gList = [];
  var hList = [];
  var minList = [];
  var currentMin;
  var i;
  var chosenMin;
  //generate open list (list of squares that I can move based on the radius, map, visible robots, previous path)
  openList =  generate_open_list(currentLocation,radius,map,previousPathsTaken);
  //calculate g for open list
  gList= calculate_open_list_g(openList, type);
  //calculate h for open list
  hList = calculate_open_list_h(currentLocation,destination,openList);
  //pick lowest g+h value as next step
  //  if there is more than one g+h min value, pick one with lowest h cost
  currentMin = gList[0]+hList[0];
  for(i = 0; i< openList.length; i++){
    if(gList[i]+hList[i] < currentMin){
      currentMin = gList[i]+hList[i];
    }
  }
  for(i = 0; i< openList.length; i++){
    if(gList[i]+hList[i] === currentMin){
      minList.push(i);
    }
  }
  if(minList.length > 1){
    currentMin = hList[minList[0]];
    chosenMin = minList[0];
    for(i = 0; i < minList.length; i++){
      if(hList[minList[i]] < currentMin){
        currentMin = hList[minList[i]];
        chosenMin = minList[i];
      }
    }
  }else{
    chosenMin = minList[0];
  }
  
  return [currentLocation[0] + openList[chosenMin][0],currentLocation[1] + openList[chosenMin][1]];
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


function get_absolute_possible_square_checkerboard_steps_list(coor,map){
  var i;
  var j;
  var k = 0;
  var result = [];
  for(i = -1; i<=1; i++){
    for(j = -1; j<=1; j++){
      if((i == 0 && j == 0) || (i == 1 && j == 0) || (i == -1 && j == 0) || (i == 0 && j == 1) || (i == 0 && j == -1)){
        continue;
      }
      if(!(coor[0] + i < 0 || coor[0] + i >= map.length || coor[1] + j < 0 || coor[1] + j >= map.length)){
        if(map[coor[1] + j][coor[0] + i] == true){
          result[k] = [i+coor[0],j+coor[1]];
          k++;
        }
      }
    }
  }
  return result;
}

function get_absolute_impossible_square_checkerboard_steps_list(coor,map){
  var i;
  var j;
  var k = 0;
  var result = [];
  for(i = -1; i<=1; i++){
    for(j = -1; j<=1; j++){
      if((i == 0 && j == 0) || (i == 1 && j == 0) || (i == -1 && j == 0) || (i == 0 && j == 1) || (i == 0 && j == -1)){
        result[k] = [i+coor[0],j+coor[1]];
        k++;
      }
      if(!(coor[0] + i < 0 || coor[0] + i >= map.length || coor[1] + j < 0 || coor[1] + j >= map.length)){
        if(map[coor[1] + j][coor[0] + i] == true){
          continue;
        }
      }
    }
  }
  return result;
}

//[{"type":"robot","id":2022,"team":0,"x":3,"y":0,"unit":2,"turn":6,"signal":-1,"signal_radius":-1},{"type":"robot","id":3650,"team":0,"x":4,"y":2,"unit":0,"turn":8,"signal":-1,"signal_radius":-1},{"type":"robot","id":3594,"team":0,"x":4,"y":1,"unit":4,"health":20,"karbonite":0,"fuel":0,"turn":1,"signal":0,"signal_radius":0,"time":120},{"type":"robot","id":1218,"team":0,"x":6,"y":2,"unit":2,"turn":7,"signal":-1,"signal_radius":-1},{"type":"robot","id":1303,"team":0,"x":6,"y":1,"unit":2,"turn":8,"signal":-1,"signal_radius":-1}]
function get_next_checkerboard_step(currentLocation,map,visibleRobots,previousPathsTaken,r){
  
  var closeRobots = visibleRobots.filter(robot => (get_distance(currentLocation, [robot.x,robot.y]) <= Math.sqrt(8) && !(robot.x == currentLocation[0] && robot.y == currentLocation[1])  && robot.unit >=2));
  var openPaths;
  var otherOpenPaths = [];
  var otherClosedPaths = [];
  var i;
  var otherRobotsLocations = [];
  var chosenPath;
  //r.log(closeRobots);
  if(closeRobots.length > 0){
    for(i = 0; i < closeRobots.length; i++){
      otherRobotsLocations[i] = [closeRobots[i].x,closeRobots[i].y];
      otherOpenPaths = otherOpenPaths.concat(get_absolute_possible_square_checkerboard_steps_list(otherRobotsLocations[i],map));
      otherClosedPaths = otherClosedPaths.concat(get_absolute_impossible_square_checkerboard_steps_list(otherRobotsLocations[i],map));
    }
    //console.log("-----------");
    
    //console.log(otherClosedPaths);
    //console.log("-----------");
    for(i = 0; i < otherOpenPaths.length; i++){
      if(check_if_coor_in_path(otherOpenPaths[i], otherRobotsLocations.concat(otherClosedPaths)) == true){
        otherOpenPaths.splice(i,1);
        i--;
      }
    }
    //console.log(otherRobotsLocations);
    //console.log(otherOpenPaths);
    for(i = 0; i < otherOpenPaths.length; i++){
      //is any of the other of both open paths at sqrt(2) distace of me? If yes move there
      var temp = get_distance(otherOpenPaths[i],currentLocation);
      //console.log(temp);
      //console.log(otherOpenPaths[i]);
      if(temp <= Math.sqrt(2) && temp > 0 && check_if_coor_in_path(otherOpenPaths[i],previousPathsTaken) == false){
        console.log("return 502");
        return otherOpenPaths[i];
      }
    }
    //else get mine if see if I can move
    openPaths = get_absolute_possible_square_checkerboard_steps_list(currentLocation,map);
    
    for(i = 0; i < openPaths.length; i++){
      if(check_if_coor_in_path(openPaths[i], otherRobotsLocations.concat(previousPathsTaken.concat(otherClosedPaths))) == true){
        openPaths.splice(i,1);
        i--;
      }
    }
    //console.log(openPaths);
    //console.log(openPaths.length);
    if(openPaths.length > 0){
      return get_random_from_list(openPaths);
    }
    return currentLocation;
  }else{
    openPaths = get_absolute_possible_square_checkerboard_steps_list(currentLocation,map);
    chosenPath = get_random_from_list(openPaths);
    while(check_if_coor_in_path(chosenPath,previousPathsTaken)){ //this option does not allow backtracking
      chosenPath = get_random_from_list(openPaths);
    }
    return chosenPath;
  }
  return;
}

function resource_map_to_coor_list(map,r){
  var i;
  var j;
  var res = [];
  //r.log("dsdsdss");
  //r.log(map);
  for(i =0; i < map.length; i++){
    for(j =0; j < map[i].length; j++){
      if(map[i][j] == true){
        //r.log("here sdffds");
        res.push([j,i]);
      }
    }
  }
  return res;
}

/**
 * This function finds clusters of resources.
 * 
 * @param {list} list  a list of objects with x and y parameters 
 * @param {list} friendly_locs  a list of objects with x and y properties (set
 *                              to 0 if you do not want this)
 * @param {list} enemy_locs a list of objects with x and y properties (set to
 *                           0 if you do not want this)
 * 
 * @returns {list} a list of objects with x and y properties.
 */
function find_clusters(list,friendly_locs,enemy_locs){

  var result = [];
  var resources = list.slice();

  while (resources.length > 0){
    var curr = resources[0];
    resources.splice(0, 1);
    if (!check_clusters(curr, friendly_locs, enemy_locs)){
      result.push(curr);
    }
    var updated = update_nodes(curr, list, []);


    for (var i = 0; i < updated.length; i++){
      if (updated[i].dist <= 5){
        for (var j = 0; j < resources.length; j++){
          if (resources[j].x === updated[i].x && resources[j].y === updated[i].y) {
            resources.splice(j, 1);
          }
        }
      }
    }
  }
  return result;
}

/**
 * Checks to see if the resource is a cluster near friendly or
 * enemy castles.
 * 
 * @param {object} resource_loc 
 * @param {list} friendly_locs 
 * @param {list} enemy_locs
 * 
 * @returns {boolean} 
 */
function check_clusters(resource_loc,friendly_locs,enemy_locs){
  if (friendly_locs === 0 && enemy_locs === 0){
    return false;
  }
  var total_locs = friendly_locs.concat(enemy_locs);
  for (var i = 0; i < total_locs.length; i++){
    var dist = get_distance([resource_loc.x, resource_loc.y], [total_locs[i].x, total_locs[i].y]);
    if (dist <= 5){
      return true;
    }
  }
  return false;
}

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
function find_nearby_nodes(loc,list,visible,range){
  var nearby_nodes = [];
  var nodes = update_nodes(loc,list,visible);
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
function get_number_of_units(visible,unit){
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

//To check if any robots are present adjacent to castle.
function find_if_robot_is_present(loc, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].x === loc[0] && list[i].y === loc[1]) {
            return false;
        }
    }
    return true;
}

//Inputs - castle location, map, and list of visible robots
//To find the possible adjancent locations around the castle to build required units.
function find_location_to_build_unit(castleLoc, map, list, resources, r) {
    // var loc;
    var locations = [
        {"x":1, "y":0},
        {"x":1, "y":1},
        {"x":0, "y":1},
        {"x":-1, "y":1},
        {"x":-1, "y":0},
        {"x":-1, "y":-1},
        {"x":0, "y":-1},
        {"x":1, "y":-1},

    ];

    var boundary = map.length;

    for (var i = 0; i < locations.length; i++){
        var build_loc = {"x": castleLoc.x + locations[i].x, "y": castleLoc.y + locations[i].y};
        if (build_loc.x >= boundary || build_loc.y >= boundary){
            continue;
        } else if (map[build_loc.y][build_loc.x] === true && find_if_robot_is_present([build_loc.x, build_loc.y], list) === true && find_if_robot_is_present([build_loc.x, build_loc.y], resources) === true){
            //r.log("build loc: " + locations[i].x + ", " + locations[i].y);
            return locations[i];
        } 
    }
    return "error";
    // r.log("castle location:" + castleLoc.x + ", " + castleLoc.y);
    // if (map[castleLoc.y][castleLoc.x + 1] === true && find_if_robot_is_present([castleLoc.x + 1, castleLoc.y], list) === true && find_if_robot_is_present([castleLoc.x, castleLoc.y], resources) === true) {
    //     loc = { 'x': 1, 'y': 0 }
    //     return loc;
    // }
    // else if (map[castleLoc.y + 1][castleLoc.x + 1] === true && find_if_robot_is_present([castleLoc.x + 1, castleLoc.y + 1], list) === true) {
    //     loc = { 'x': 1, 'y': 1 }
    //     return loc;
    // }
    // else if (map[castleLoc.y + 1][castleLoc.x] === true && find_if_robot_is_present([castleLoc.x, castleLoc.y + 1], list) === true) {
    //     loc = { 'x': 0, 'y': 1 }
    //     return loc;
    // }
    // else if (map[castleLoc.y + 1][castleLoc.x - 1] === true && find_if_robot_is_present([castleLoc.x - 1, castleLoc.y + 1], list) === true) {
    //     loc = { 'x': -1, 'y': 1 }
    //     return loc;
    // }
    // else if (map[castleLoc.y][castleLoc.x - 1] === true && find_if_robot_is_present([castleLoc.x - 1, castleLoc.y], list) === true) {
    //     loc = { 'x': -1, 'y': 0 }
    //     return loc;
    // }
    // else if (map[castleLoc.y - 1][castleLoc.x - 1] === true && find_if_robot_is_present([castleLoc.x - 1, castleLoc.y - 1], list) === true) {
    //     loc = { 'x': -1, 'y': -1 }
    //     return loc;
    // }
    // else if (map[castleLoc.y - 1][castleLoc.x] === true && find_if_robot_is_present([castleLoc.x, castleLoc.y - 1], list) === true) {
    //     loc = { 'x': 0, 'y': -1 }
    //     return loc;
    // }
    // else if (map[castleLoc.y - 1][castleLoc.x + 1] === true && find_if_robot_is_present([castleLoc.x + 1, castleLoc.y - 1], list) === true) {
    //     loc = { 'x': 1, 'y': -1 }
    //     return loc;
    // }
}

function format_integer(int){
    if (int < 10){
        return String("0" + int);
    }
    return String(int);
}

function transmit_location(r,location,range){
    r.log("1"+format_integer(location.x) + format_integer(location.y));
    return r.signal(parseInt("1"+format_integer(location.x)+format_integer(location.y)), range);
}

function parse_message(r, visible){
    // r.log(visible);
    for (var i = 0; i < visible.length; i++){
        var sig = visible[i].signal;
        // If the signal is greater than 10, it must be a loc
        if (sig > 10 && visible[i].unit === 0){
            var xcoor = Math.floor(sig/100) - 100;
            var ycoor = (sig % 100);
            return {"x":xcoor, "y":ycoor};
        }
    }
    return {"x":-1, "y": -1};
}
var ATTACK = 61440;



function encode_attack(loc){
  return encode_location(loc) | ATTACK;
  
}
/**


0000 00 = 0
1111 11 = 63
**/
function encode_location(loc){
  var xLocation = loc[0] << 6;
  var yLocation = loc[1] << 0;
  return xLocation | yLocation;
  
}

/**
Format is:
4 MSB is what to do code
currently only 1111 and 1110 are reserved
next 6 MSB are y location
next 6MSB are x location
**/
function decode_location(radioNumber){
  //radioNumber = radioNumber >> 4;
  var yLocation = radioNumber & parseInt("0000000000111111",2);
  var xLocation = (radioNumber & parseInt("0000111111000000",2)) >> 6;
  
  return [xLocation,yLocation];
}

const pilgrim = {};
var currentPath = [];
var hasBase = false;
var resource_list;
var castleLoc = { 'x': -1, 'y': -1 };
var destination = {"x": -1, "y": -1};
var step = -1;

pilgrim.takeTurn = (self) => {


  var curr_loc = { 'x': self.me.x, 'y': self.me.y };
  var visible = self.getVisibleRobots();

  //Using this to count pilgrims
  self.castleTalk(2);
  step++;
  if (step === 0) {
    //self.log("pilgrim initializing....");
    // This assigns castle loc to nearest castle or church
    if (get_number_of_units(visible, 1) === 0) {
      castleLoc = find_nearest_unit(curr_loc, visible, 0);
    } else {
      castleLoc = find_nearest_unit(curr_loc, visible, 1);
    }
    // This will find the neareast resource
    var karbonite = get_resource_nodes(self.getKarboniteMap());
    var fuel = get_resource_nodes(self.getFuelMap());
    resource_list = karbonite.concat(fuel);
    var updated_nodes = update_nodes(curr_loc, resource_list, visible);    
    var nearest_karb = find_nearest_unoccupied_node(curr_loc, updated_nodes);
    //self.log("Nearest karb");
    //self.log(nearest_karb);
    if (get_distance([curr_loc.x, curr_loc.y], [nearest_karb.x, nearest_karb.y]) <= 8){
      // Their destination will be this node now
      destination = nearest_karb;
      hasBase = true;
      //self.log("Mining at:");
      //self.log(destination);
    }
  }
  // this.log("(" + nearest_karb.x + "," + nearest_karb.y+ ")");
  if (destination.x == -1){
    self.castleTalk(10);
    destination = parse_message(self, visible);
    //self.log("Received message");
    //self.log(destination);
    if (destination.x == -1){
      return;
    }
    self.castleTalk(2);
  }

  //This is a quick fix to the signalling, sometimes 

  // Need to check when we get close to resource if it's occupied
  if (get_distance([curr_loc.x, curr_loc.y], [destination.x, destination.y]) <= 2 && !hasBase){
    var updated_nodes = update_nodes(curr_loc, resource_list, visible);
    var nearest_karb = find_nearest_unoccupied_node(curr_loc, updated_nodes);
    // If they are not the same, then we need to signal for help
    if (nearest_karb.x != destination.x && nearest_karb.y != destination.y){
      destination = {"x": -1, "y": -1};
    }
  }


  





  if (self.me.karbonite !== 20 && self.me.fuel !== 100 && destination.x != -1) {
    if (curr_loc.x === destination.x && curr_loc.y === destination.y) {
      hasBase = true;
      ////self.log("I am mining!");
      //this.log("I am carrying " + this.me.fuel + " fuel, and " + this.me.karbonite);
      return self.mine();
    }
    //self.log("here");
    var nexStep = get_next_step_astar_turn([self.me.x, self.me.y], [destination.x, destination.y], self.map, currentPath.concat(get_visible_robots_list(visible)), 2);
    var movex = nexStep[0] - self.me.x;
    var movey = nexStep[1] - self.me.y;
    //self.log("my pos  " + self.me.x + "  :  " + self.me.y);
    //self.log("location : " + self.me.x + "," +self.me.y);
   // self.log("movement : " + movex + ";" + movey);
    if (!hasBase){
      currentPath.push([self.me.x, self.me.y]);
    }
    ////self.log("haaaaaaaaaaa   " +   self.map[nexStep[1]][nexStep[0]]);
    return self.move(movex, movey);
  } else {
    var dist = get_distance([self.me.x, self.me.y], [castleLoc.x, castleLoc.y]);
    // If the castle is far away, we should build a church
    // Or set ourselves to nearest church or castle if they exist
    if (dist >= 5) {
      var num_castles = get_number_of_units(visible, 0);
      if (num_castles >= 1){
        castleLoc = find_nearest_unit(curr_loc, visible, 0);
      }
      var num_churches = get_number_of_units(visible, 1);
      if (num_churches === 0 && self.karbonite >= 50 && self.fuel >= 200) {
        self.castleTalk(11);
        //self.log("I am going to build a church");
        var build_loc = find_location_to_build_unit(curr_loc, self.getPassableMap(), visible, resource_list, self);
        var buildPlace = [build_loc.x, build_loc.y];
        return self.buildUnit(SPECS.CHURCH, buildPlace[0], buildPlace[1]);
      }
      else if (num_churches >= 1) {
        castleLoc = find_nearest_unit(curr_loc, visible, 1);
      }
      //Wait to build a church
      else if(num_churches < 1 && num_castles < 1){
        self.log("Waiting to build a church...");
        return
      }
      dist = get_distance([self.me.x, self.me.y], [castleLoc.x, castleLoc.y]);

    }
    if (dist <= Math.sqrt(2)) {
      // //self.log("I am unloading resources");
      currentPath = [];
      var dx = castleLoc.x - curr_loc.x;
      var dy = castleLoc.y - curr_loc.y;
      return self.give(dx, dy, self.me.karbonite, self.me.fuel);
    }
    //self.log("tetetettete");
    var nexStep = get_next_step_astar_turn([self.me.x, self.me.y], [castleLoc.x, castleLoc.y], 
    
    self.map, currentPath.concat(get_visible_robots_list(visible)), 2);
    var movex = nexStep[0] - self.me.x;
    var movey = nexStep[1] - self.me.y;
    ////self.log("location : " + self.me.x + "," +self.me.y);
    ////self.log("movement : " + movex + ";" + movey);
    ////self.log("here");
    return self.move(movex, movey);
  }

};

const castle = {};
var pilgrimCount = 0;
var maxPilgrims = 0;
var pilgrimDelta;
var castle_loc = { x: 0, y: 0 };
var map = [];
var friendly_castles = [];
var resource_list$1;
var nearby_nodes;
var enemy_castles = [];
var numCastles = 0;
var resource_clusters = [];
var minAttackUnits = 5;
var prime = 0;
var foundMaster = false;
var MASTER = 13;
var HEARTBEAT = 213;
var ATTACK_INCOMING = 215;
var locSentCounter = 0;
var minimumFuel = 150;
var minimumKarb = 25;
var friendlyCastlesNumbered = 0;
var possiblePrimes = [2, 3, 5];
var canBuild = true;
var beingAttack = false;
var firstPilgrimWaveDone = false;
castle.takeTurn = (self) => {


  var visible = self.getVisibleRobots();
  ////self.log(enemy_castles);
  ////self.log(self.step);
  // self.log("Pilgrim count: " + pilgrimCount);
  // self.log("Max pilgrims: "+ maxPilgrims);
  var castleMasterSignal = visible.filter(robot => robot.castle_talk == MASTER);
  var castleAttackSignal = visible.filter(robot => robot.castle_talk == ATTACK_INCOMING && robot.id != self.id);
  var enemyRobots = visible.filter(robot => robot.team != self.me.team && robot.signal_radius == -1);

  var nearby_attack_units = visible.filter(robot => robot.team === self.me.team && robot.unit >= 3);
  if (self.step > 75  || (nearby_attack_units.length >= minAttackUnits && resource_clusters.length > 0)) {
    //We can build pilgrims to mine the clusters
    maxPilgrims += pilgrimDelta;
    pilgrimDelta = 0;
  }
  ////self.log(castleMasterSignal);
  // Initialize to figure out how many pilgrims to build
  if (self.step <= 0) {

    castle_loc.x = self.me.x;
    castle_loc.y = self.me.y;
    var karbonite = get_resource_nodes(self.getKarboniteMap());
    var fuel = get_resource_nodes(self.getFuelMap());
    resource_list$1 = karbonite.concat(fuel);
    ////self.log(resource_list);
    // Checks for resources in a 4 r^2 range
    nearby_nodes = find_nearby_nodes(castle_loc, resource_list$1, visible, 6);
    map = self.getPassableMap();
    // Build 1 more pilgrim so it can go off and build a church
    maxPilgrims = nearby_nodes.length;
    //self.log("start.  maxPIlgimrs  " + maxPilgrims);
    // self.log(pilgrimCount);
    numCastles = visible.filter(robot => robot.team == self.me.team).length;


    friendly_castles.push({ "x": self.me.x, "y": self.me.y });
    numCastles--;
    if (numCastles == 0) {
      prime = 1;
      foundMaster = true;
    } else {
      prime = get_random_from_list([3, 5, 7]);
    }
    ////self.log(numCastles);
    //self.log("start. my prime is  " + prime);
    ////self.log(visible);
  }
  if(pilgrimCount == nearby_nodes.length){
    firstPilgrimWaveDone = true;
  }
  //Check if number of pilgrims in the radius of the castle, are equal to nearby_nodes.
  var pilgrims_nearby = visible.filter(robot => robot.team === self.me.team && robot.unit === 2);
  //self.log("pC before  " + pilgrimCount);
  //self.log(self.step + "pilgrims_nearby  " + pilgrims_nearby.length + "   :   " + nearby_nodes.length);
  if(pilgrims_nearby.length < nearby_nodes.length && firstPilgrimWaveDone == true) {
    //if we are under attack and have friendly castles, do not build more pilgirms
    if(enemyRobots.length ==0){
        var delta =  pilgrims_nearby.length - nearby_nodes.length;
      ///decrement pilgrimCount in order to build more pilgrims.
      //self.log("*************************************************need new pilgrims  " + pilgrimCount);
      pilgrimCount += delta;//Math.abs(pilgrimCount - delta);
      if (pilgrimCount < 0){
        pilgrimCount = 0;
      }
      
     // self.log("new ilgir count  " + pilgrimCount);
    }
	  
  }  
 // self.log("pC after  " + pilgrimCount);
  // //self.log("here 97");
  // Assigns pilgrims to clusters
  for (var i = 0; i < visible.length; i++) {
    if (visible[i].castle_talk === 10) {
      ////self.log("pilgrim needs loc");
      if (visible[i].x) {
        ////self.log("I am going to transmit to:");
        ////self.log(visible[i]);
        var reset = false;
        if (resource_clusters.length === 1) {
          reset = true;
        }
        var dest = resource_clusters[0];
        var dist = Math.ceil(get_distance([castle_loc.x, castle_loc.y], [visible[i].x, visible[i].y]));
        ////self.log("Distance to transmit is : " + dist)
        transmit_location(self, dest, Math.pow(dist, 2));
        ////self.log(resource_clusters);
        resource_clusters.splice(0, 1);
        if (reset) {
          resource_clusters = find_clusters(resource_list$1, friendly_castles, enemy_castles);
        }
        ////self.log("Deleted a resource cluster");
        ////self.log(resource_clusters);
      }
    }
  }

  ////self.log("here 128");
  // // Sending a signal to determine number of castles
  if (self.step == 0 && numCastles != 0) {
    ////self.log("sending signal heartbeat");
    self.signal(1, Math.pow(self.getPassableMap().length, 2));
    self.castleTalk(1);
  }
  // //self.log("here 135");
  // // We can add to friendly castle array
  if (numCastles != 0) {
    ////self.log(self.step + "  trying to get castles");
    //self.castleTalk(1); 
    // var visible = self.getVisibleRobots();
    ////self.log(visibmaxPilgrims + 
    ////self.log(visibmaxPilgrims + 
    for (var i = 0; i < visible.length; i++) {
      if (visible[i].castle_talk === 1 && visible[i].x != self.me.x && visible[i].y != self.me.y) {
        friendly_castles.push({ "x": visible[i].x, "y": visible[i].y });
        numCastles--;
      }
    }
    // self.log("Friendly castles");
    // self.log(friendly_castles);
  }
  // // We can calculate enemy castles now
  if (numCastles == 0 && enemy_castles.length < friendly_castles.length) {
    for (var i = 0; i < friendly_castles.length; i++) {
      var enemy = find_possible_castle_locations([friendly_castles[i].x, friendly_castles[i].y], self.map, self.getKarboniteMap());
      enemy_castles.push({ "x": enemy[0], "y": enemy[1] });
    }
    // This just arranges by distance (might not be needed)
    enemy_castles = update_nodes(castle_loc, enemy_castles, []);
    // self.log("Enemy castles");
    // self.log(enemy_castles);
  }
  // We can find the clusters now
  // self.log(resource_clusters.length)
  if (enemy_castles.length === friendly_castles.length && resource_clusters.length < 1) {
    resource_clusters = find_clusters(resource_list$1, friendly_castles, enemy_castles);
    pilgrimDelta = Math.ceil(resource_clusters.length / friendly_castles.length);
  }
  ////self.log(self.step + "  step  " + prime);
  /*//self.log("numCastles  " + numCastles);
  //self.log("friendlyCastlesNumbered   " + friendlyCastlesNumbered);
  //self.log("friendly_castles.legnth  "  +friendly_castles.length); 
  //self.log(foundMaster);*/
  // //self.log("here 176");
  if (foundMaster == true && prime != 1) {
    ////self.log("sending heartbeat  "  + self.step);
    self.castleTalk(HEARTBEAT);
    var castleHeartbeatSignal = visible.filter(robot => robot.castle_talk >= HEARTBEAT && robot.id != self.id);
    ////self.log("castleHeartbeatSignal");
    ////self.log(castleHeartbeatSignal);
    if (self.step > 50 && castleHeartbeatSignal.length == 0) {
      self.log("*********************************************************************************all castles eliminated, i am the only one");
      prime = 1;
    }
  }
  if (foundMaster == false && numCastles == 0 && friendlyCastlesNumbered == friendly_castles.length - 1) {
    prime = possiblePrimes[friendlyCastlesNumbered];
    self.log("my prime  " + prime);
    foundMaster = true;
  }
  if (foundMaster == false && numCastles == 0 && castleMasterSignal.length > 0) {
    self.log("found other castle wanting to be master");
    //self.log(castleMasterSignal);
    friendlyCastlesNumbered += castleMasterSignal.length;
    //foundMaster = true;
  }
  if (foundMaster == false && numCastles == 0 && friendlyCastlesNumbered < friendly_castles.length && self.step > 0 && self.step % prime == 0) {
    self.castleTalk(MASTER);
    self.log("i am master   " + prime + "   " + self.step);
    prime = possiblePrimes[friendlyCastlesNumbered];
    self.log("my prime  " + prime);
    foundMaster = true;
  }

  if (enemyRobots.length >= 1 || (enemyRobots.length == 1 && get_distance([self.me.x, self.me.y], [enemyRobots[0].x, enemyRobots[0].y]) <= 10)) {
    //self.log(enemyRobots);
   //  self.log(self.step +  "--------------------------------------------------------------------------i am being attacked, need all resources");
   minimumKarb = 10;
    self.castleTalk(ATTACK_INCOMING);
    prime = 1;
    canBuild = true;
    beingAttack = true;
  } else {
    if (castleAttackSignal.length > 0) {
    //  self.log(self.step +  "--------------------------------------------------------------------------somebody is being attacked, they need all resources");
      canBuild = false;
    } else {
      + Math.floor(resource_clusters.length / numCastles);
      if (beingAttack == true) {
        //self.log("sending herabeat after attacK");
        beingAttack = false;
        minimumKarb = 35;
        self.castleTalk(HEARTBEAT);
        prime = possiblePrimes[friendlyCastlesNumbered];
      }
      canBuild = true;


    }



  }




  /***************** BUILD SECTION  **********************/
  ////self.log("pilgrimCount   " + pilgrimCount);
  if (self.step > 0 && self.step % 2 === 0 && pilgrimCount < maxPilgrims && self.karbonite >= (10 + minimumKarb) && self.fuel >= (50 + minimumFuel) && canBuild == true && enemyRobots.length ==0) {
   // self.log("Building a pilgrim at " + (self.me.x + 1) + ", " + (self.me.y + 1));
    pilgrimCount++;
    var build_loc = find_location_to_build_unit(castle_loc, map, visible, resource_list$1, self);
    return self.buildUnit(SPECS.PILGRIM, build_loc.x, build_loc.y);

  }

  if ((self.step <= (222 + prime * prime) + enemy_castles.length && self.step > (222 + prime * prime)) ||
    (self.step <= (500 + prime * prime) + enemy_castles.length && self.step > (500 + prime * prime)) ||
    (self.step <= (750 + prime * prime) + enemy_castles.length && self.step > (750 + prime * prime)) || 
    (self.step <= (900 + prime * prime) + enemy_castles.length && self.step > (900 + prime * prime))) {
    ////self.log("trying to send message");
    ////self.log([enemy_castles[0].x,enemy_castles[0].y]);
    var toSend = locSentCounter % enemy_castles.length;
    ////self.log(enemy_castles.length);
    ////self.log(enemy_castles[toSend]);
    self.signal(encode_attack([enemy_castles[toSend].x, enemy_castles[toSend].y]), Math.pow(7, 2));
    locSentCounter++;
  }
  /*if(enemy_castles.length == 1){
    prime = 1;
  }*/
  ////self.log("canBuild    "   + canBuild + "   prime   " + prime);
  if (self.step > 0 && self.step % prime == 0 && (pilgrimCount >= maxPilgrims || enemyRobots.length >= 1) && self.karbonite >= (25 + minimumKarb ) && (50 + minimumFuel) && canBuild == true) {
    //self.log("buidlattack unit");
    var build_loc = find_location_to_build_unit(castle_loc, map, visible, self);
    var buildPlace = [build_loc.x, build_loc.y];
    if (nearby_attack_units.length >= minAttackUnits){
      return self.buildUnit(Math.floor(Math.random() * (4 - 3 + 1)) + 3, buildPlace[0], buildPlace[1]);
    }else{
      return self.buildUnit(4, buildPlace[0], buildPlace[1]);
    }
    
  }
  else {
    var enemies = get_visible_enemies(self.me.team, visible);
    var curr_loc = { 'x': self.me.x, 'y': self.me.y };
    if (enemies.length !== 0) {
      ////self.log("We see an enemy!");
      var target = find_nearest_node(curr_loc, enemies);
      //Check if in range
      var dist = get_distance([curr_loc.x, curr_loc.y], [target.x, target.y]);
      if (dist <= 8) {
        ////self.log("Attacking enemy!");
        var attack = get_relative_position(curr_loc, target);
        return self.attack(attack.x, attack.y);
      }
    }
  }

};

const prophet = {};
var currentPath$2 = [];
var done = false;
var fuelPaths = [];
var karbPaths = [];
var closestBuilding ;
var newTarget = false;
var targetLocations = [];
var targetCounter = 0;
var canMove = true;
prophet.takeTurn = (self) => {
  //self.log(self.step + "");
  var nextStep;
  var curr_loc = {'x': self.me.x, 'y':self.me.y};
  var visible = self.getVisibleRobots();
  var counter = 0;
  //self.log(curr_loc);
  //self.log(visible);
  if(self.fuel < 1000){
    canMove =false;
  }else if(self.fuel < 50){
    return;
  }else{
    canMove = true;
  }
  
  if(self.step == 0){
    karbPaths = resource_map_to_coor_list(self.karbonite_map,self);
    fuelPaths = resource_map_to_coor_list(self.fuel_map,self);
    var  temp = visible.filter(robot => (robot.unit == 0 || robot.unit == 1));
    closestBuilding = [temp[0].x, temp[0].y];
  }
  //always check for attacking first to defend properly
  var enemies = get_visible_enemies(self.me.team, visible);
  //self.log(enemies);
  if (enemies.length !== 0){
    //self.log("We see an enemy!");
    var target = find_nearest_node(curr_loc, enemies);
    //self.lof(target);
    //Check if in range
    var dist = get_distance([curr_loc.x,curr_loc.y], [target.x,target.y]);
    if (dist <= 16 && dist >= 4){
      //self.log("Attacking enemy!: " + dist);
      //self.log(curr_loc);
      //self.log(target)
      //self.log("ATTACL");
      //self.log(target);
      var attack = get_relative_position(curr_loc, target);
      
     // self.log(attack);
      return self.attack(attack.x, attack.y);      
    }else if( dist <= 4 && target.unit == 3 && canMove == true){
      self.log("movign away from crusader");
      var nexStep = get_next_step_astar_turn([self.me.x,self.me.y],[target.x -4 ,target.y -4],self.map,[],2);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      return self.move(movex,movey);
    }               
  }
  //this is to make sure we do more work if we are close to overdrawn
  if(self.time <20){
    return;
  }
  //here I found my spot, so mayb I can start listening for instructions
  //will have to make sure all castles (or only one caslte) send the same signal, else might create confusion
  var availableSignals = visible.filter(robot =>  robot.signal >= 4096);
  if (availableSignals.length > 0){
    //self.log(availableSignals);
    var code = availableSignals[0].signal &  ATTACK;
    //self.log("my code is: " +code);
    if(code == ATTACK){
      //self.log("//////////////////////////////////////////////prophet received attack code");
     // self.log(availableSignals);
      newTarget = true;
      //self.log(availableSignals);
      var loc = decode_location(availableSignals[0].signal);
      if(check_if_coor_in_path(loc,targetLocations) == false){
        targetLocations.push(loc);
        currentPath$2 = [];
        //self.log(targetLocations);
        //self.log(message.decode_location(availableSignals[0].signal));
        self.signal(encode_attack(targetLocations[targetCounter]), Math.pow(5,2)/*Math.pow(self.getPassableMap().length, 2)*/);
        //self.log("prophet new attack loc   " );
        //self.log(targetLocations);
      }
    }
  }
  if(newTarget == true){
    //self.log(targetLocations);
    if(get_distance([curr_loc.x,curr_loc.y],targetLocations[targetCounter]) < 4 && targetCounter < (targetLocations.length-1)){
     // self.log("CCSSCS");
      //self.log("prophet trying to change direction");
     // self.log(targetLocations);
     // self.log(targetLocations[targetLocations.length-1]);
     // self.log(targetLocations[targetCounter]);
      //targetLocations.push(targetLocations[targetCounter]);
    //  self.log(targetLocations);
    //  
     // self.log(targetLocations[targetLocations.length-1]);
      //self.log("end");
      targetCounter++;
      self.signal(encode_attack(targetLocations[targetCounter]), Math.pow(20,2)/*Math.pow(self.getPassableMap().length, 2)*/);
      // self.log("prophet new taregt   "  + targetLocations[targetCounter]);
    }
    if(canMove == true){
      //self.log("here");
      var nexStep = get_next_step_astar_fuel([self.me.x,self.me.y],targetLocations[targetCounter],self.map,
        currentPath$2.concat(get_visible_robots_list(self.getVisibleRobots())),2);
      currentPath$2.push([self.me.x, self.me.y]);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      
      return self.move(movex,movey);
    }else{
      return;
    }
  }
  
  if(self.step < 2){
    var nexStep = get_next_step_astar_turn([self.me.x,self.me.y],find_possible_castle_locations([self.me.x-1,self.me.y-1],self.map,self.fuel_map),self.map,
    currentPath$2.concat(get_visible_robots_list(self.getVisibleRobots())),2);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      //self.log("stepCounter : " + stepCounter);
      //self.log("location : " + self.me.x + "," +self.me.y);
      return self.move(movex,movey);
  }
  if(done === false){
    //self.log("done is false");
    //self.log(building[0]);
    var nextStep = get_next_checkerboard_step([self.me.x,self.me.y],self.map,self.getVisibleRobots(),currentPath$2.concat(karbPaths.concat(fuelPaths)),self);
    if(nextStep[0] == self.me.x && nextStep[1] == self.me.y || get_distance(nextStep, closestBuilding) <= Math.sqrt(8)){
      //need to go somehere
     // self.log("need to go somehere");
      nextStep = get_possible_square_steps_list([self.me.x,self.me.y],self.map);
      var nearRobots = get_visible_robots_list(self.getVisibleRobots());
      var current = get_random_from_list(nextStep);
      while(check_if_coor_in_path([current[0] + self.me.x, current[1] + self.me.y], nearRobots.concat(currentPath$2)) == true){
        
        counter++;
        if (counter >=3){
          return;
        }
        //self.log("in while");
        current = get_random_from_list(nextStep);
        
      }
      
      //self.log("no pass");
      //self.log(current);
      currentPath$2.push([self.me.x, self.me.y]);
      return self.move(current[0],current[1]);
    }else{
      //self.log("in else");
      var movex = nextStep[0] - self.me.x;
      var movey = nextStep[1] - self.me.y;
      done = true;
      //self.log("done");
      //self.log(nextStep);
      return self.move(movex,movey);
    }
    
  }

};

const church = {};
var pilgrimCount$1 = 0;
var castle_loc$1 = { x: 0, y: 0 };
var map$1 = [];
var resource_list$2;
var nearbyNodeCount = 0;
var prime$1 =0;
church.takeTurn = (self) => {


    // var possibleSteps = movement.get_possible_square_steps_list([self.me.x, self.me.y],self.map);
    // //self.log("lala");
    // //self.log(possibleSteps);
    // var buildPlace = movement.get_random_from_list(possibleSteps);
    // var messagingRobots = self.getVisibleRobots().filter(robot => {
    //     if (robot.signal == 666 || robot.signal == 6969){
    //       return robot;
    //     }
    //     return;
    // });
    //self.log("msg");
    //self.log(messagingRobots);

    //self.log(buildPlace);

    var visible = self.getVisibleRobots();
    // Initialize to figure out how many pilgrims to build
    if (self.step < 1) {
        castle_loc$1.x = self.me.x;
        castle_loc$1.y = self.me.y;
        
        var karbonite = get_resource_nodes(self.getKarboniteMap());
        var fuel = get_resource_nodes(self.getFuelMap());
        resource_list$2 = karbonite.concat(fuel);
        // Checks for resources in a 4 r^2 range
        var nearby_nodes = find_nearby_nodes(castle_loc$1, resource_list$2, visible, 4);
        map$1 = self.getPassableMap();
         prime$1 = get_random_from_list([5,7,11]);
        pilgrimCount$1 = nearby_nodes.length - 1;
        nearbyNodeCount = nearby_nodes.length;
        //self.log(pilgrimCount);
    }
    
     if (self.step > 0 && self.step < 4) {
       var build_loc = find_location_to_build_unit(castle_loc$1, map$1, visible, self);
        buildPlace = [build_loc.x, build_loc.y];
         return self.buildUnit(Math.floor(Math.random() * (4 - 3 + 1) ) + 3, buildPlace[0], buildPlace[1]);
       
     }
    // This is to check to see if we need to replace any pilgrims
    // if (self.step % 50 === 49){
    //   var visible = self.getVisibleRobots(); 
    //   var tempCount = resource.get_number_of_units(visible, 2);
    //   pilgrimCount = nearbyNodeCount - tempCount;
    //   self.log("New pilgrim count!" + pilgrimCount);
    // }

    if (self.step % 10 == 0 && pilgrimCount$1 > 0 && self.karbonite >= 10*3 && self.fuel >= 50 + 400) {
       // self.log("Building a pilgrim at " + (self.me.x + 1) + ", " + (self.me.y + 1));
        pilgrimCount$1--;
        var visible = self.getVisibleRobots();
        var build_loc = find_location_to_build_unit(castle_loc$1, map$1, visible, resource_list$2, self);
        var buildPlace = [build_loc.x, build_loc.y];
        return self.buildUnit(SPECS.PILGRIM, buildPlace[0], buildPlace[1]);

    }
    if (  self.step >0 &&  self.step % prime$1 == 0  && pilgrimCount$1 === 0 && self.karbonite >= 25*3 && self.fuel >= 50 + 400) {
      // self.log("building prophet");
       //self.log(castle_loc);
       //self.log(visible + "");
        var build_loc = find_location_to_build_unit(castle_loc$1, map$1, visible, self);
        buildPlace = [build_loc.x, build_loc.y];
         return self.buildUnit(Math.floor(Math.random() * (4 - 3 + 1) ) + 3, buildPlace[0], buildPlace[1]);
    }

};

const crusader = {};
var currentPath$4 = [];
var done$1 = false;
var fuelPaths$1 = [];
var karbPaths$1 = [];
var closestBuilding$1 ;
var newTarget$1 = false;
var targetLocations$1 = [];
var targetCounter$1 = 0;
var canMove$1 = true;
crusader.takeTurn = (self) => {
  //self.log(self.step + "");
  var nextStep;
  var curr_loc = {'x': self.me.x, 'y':self.me.y};
  var visible = self.getVisibleRobots();
  var counter = 0;
  //self.log(curr_loc);
  //self.log(visible);
  
  if(self.fuel < 500){
    canMove$1 =false;
  }else if(self.fuel < 50){
    return;
  }else{
    canMove$1 = true;
  }
  
  if(self.step == 0){
    karbPaths$1 = resource_map_to_coor_list(self.karbonite_map,self);
    fuelPaths$1 = resource_map_to_coor_list(self.fuel_map,self);
    var  temp = visible.filter(robot => (robot.unit == 0 || robot.unit == 1));
    closestBuilding$1 = [temp[0].x, temp[0].y];
  }
  //always check for attacking first to defend properly
  var enemies = get_visible_enemies(self.me.team, visible);
  //self.log(enemies);
  if (enemies.length !== 0){
    //self.log("We see an enemy!");
    var target = find_nearest_node(curr_loc, enemies);
    //self.log(target);
    //Check if in range
    var dist = get_distance([curr_loc.x,curr_loc.y], [target.x,target.y]);
    if (dist < 4){
      //self.log("Attacking enemy!: " + dist);
      //self.log(curr_loc);
      //self.log(target)
      //self.log("ATTACL");
      //self.log(target);
      var attack = get_relative_position(curr_loc, target);
      
     // self.log(attack);
      return self.attack(attack.x, attack.y);      
    }else{
      if (target.unit == 4){
        self.log("movign towards prophet");
         var nexStep = get_next_step_astar_turn([self.me.x,self.me.y],[target.x,target.y],self.map,[],3);
          var movex = nexStep[0] - self.me.x;
          var movey = nexStep[1] - self.me.y;
          return self.move(movex,movey);
      }
    }                    
  }
  //this is to make sure we do more work if we are close to overdrawn
  if(self.time <20){
    return;
  }
  //here I found my spot, so mayb I can start listening for instructions
  //will have to make sure all castles (or only one caslte) send the same signal, else might create confusion
  var availableSignals = visible.filter(robot =>  robot.signal >= 4096);
  if (availableSignals.length > 0){
    //self.log(availableSignals);
    var code = availableSignals[0].signal &  ATTACK;
    //self.log("my code is: " +code);
    if(code == ATTACK){
     // self.log("//////////////////////////////////////////////crusader received attack code");
     // self.log(availableSignals);
      newTarget$1 = true;
      //self.log(availableSignals);
      var loc = decode_location(availableSignals[0].signal);
      if(check_if_coor_in_path(loc,targetLocations$1) == false){
        targetLocations$1.push(loc);
        currentPath$4 = [];
        //self.log(targetLocations);
        //self.log(message.decode_location(availableSignals[0].signal));
        self.signal(encode_attack(targetLocations$1[targetCounter$1]), Math.pow(5,2)/*Math.pow(self.getPassableMap().length, 2)*/);
        //self.log("crusader new attack loc   " );
       // self.log(targetLocations);
      }
      
    }
  }
  if(newTarget$1 == true){
    //self.log(targetLocations);
    if(get_distance([curr_loc.x,curr_loc.y],targetLocations$1[targetCounter$1]) < 4 && targetCounter$1 < (targetLocations$1.length-1)){
      //self.log("crusader trying to change direction");
      
     // self.log(targetLocations);
     // self.log(targetLocations[targetLocations.length-1]);
     // self.log(targetLocations[targetCounter]);
      //targetLocations.push(targetLocations[targetCounter]);
    //  self.log(targetLocations);
    //  
     // self.log(targetLocations[targetLocations.length-1]);
      //self.log("end");
      targetCounter$1++;
      self.signal(encode_attack(targetLocations$1[targetCounter$1]), Math.pow(20,2)/*Math.pow(self.getPassableMap().length, 2)*/);
      //self.log("crusader new taregt   "  + targetLocations[targetCounter]);
    }
    //self.signal(message.encode_attack(targetLocations[targetCounter]), Math.pow(5,2)/*Math.pow(self.getPassableMap().length, 2)*/);
    //self.log("here");
    if(canMove$1 == true){
      var nexStep = get_next_step_astar_turn([self.me.x,self.me.y],targetLocations$1[targetCounter$1],self.map,
        currentPath$4.concat(get_visible_robots_list(self.getVisibleRobots())),3);
      currentPath$4.push([self.me.x, self.me.y]);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      return self.move(movex,movey);
    }else{
      return;
    }
  }
  
  if(self.step < 2){
    var nexStep = get_next_step_astar_turn([self.me.x,self.me.y],find_possible_castle_locations([self.me.x-1,self.me.y-1],self.map,self.fuel_map),self.map,
    currentPath$4.concat(get_visible_robots_list(self.getVisibleRobots())),3);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      //self.log("stepCounter : " + stepCounter);
      //self.log("location : " + self.me.x + "," +self.me.y);
      return self.move(movex,movey);
  }
  if(done$1 === false){
    //self.log("done is false");
    //self.log(currentPath.concat(karbPaths.concat(fuelPaths)));
    var nextStep = get_next_checkerboard_step([self.me.x,self.me.y],self.map,self.getVisibleRobots(),currentPath$4.concat(karbPaths$1.concat(fuelPaths$1)),self);
    if(nextStep[0] == self.me.x && nextStep[1] == self.me.y || get_distance(nextStep, closestBuilding$1) <= Math.sqrt(8)){
      //need to go somehere
     // self.log("need to go somehere");
      nextStep = get_possible_square_steps_list([self.me.x,self.me.y],self.map);
      var nearRobots = get_visible_robots_list(self.getVisibleRobots());
      var current = get_random_from_list(nextStep);
      while(check_if_coor_in_path([current[0] + self.me.x, current[1] + self.me.y], nearRobots.concat(currentPath$4)) == true){
        
        counter++;
        if (counter >=3){
          return;
        }
        //self.log("in while");
        current = get_random_from_list(nextStep);
        
      }
      
      //self.log("no pass");
      //self.log(current);
      currentPath$4.push([self.me.x, self.me.y]);
      return self.move(current[0],current[1]);
    }else{
      //self.log("in else");
      var movex = nextStep[0] - self.me.x;
      var movey = nextStep[1] - self.me.y;
      done$1 = true;
      //self.log("done");
      //self.log(nextStep);
      return self.move(movex,movey);
    }
    
  }

};

const preacher = {};
var stepCounter$3 = 0;
var currentPath$5 = [];
var castlePaths$3;


preacher.takeTurn = (self) => {
    if (self.step === 0) {
        castlePaths$3 = find_possible_castle_locations([self.me.x - 1, self.me.y - 1], self.map, self.fuel_map);
        stepCounter$3 = 0;
    }

    var visible = self.getVisibleRobots();
    var enemies = get_visible_enemies(self.me.team, visible);
    var curr_loc = { 'x': self.me.x, 'y': self.me.y };
    if (enemies.length !== 0) {
        var target = find_nearest_node(curr_loc, enemies);
        //Check if in range
        var dist = get_distance([curr_loc.x, curr_loc.y], [target.x, target.y]);
        if (dist <= 4) {
            var attack = get_relative_position(curr_loc, target);
            return self.attack(attack.x, attack.y);
        }
    }
    if (self.step < 6 || visible.length > 2) {


        currentPath$5[stepCounter$3] = [self.me.x, self.me.y];
        if (stepCounter$3 == 0) {
            stepCounter$3++;
            if (Math.abs(castlePaths$3[0] - self.me.x) == 1) {
                return self.move(-1, 0);
            }
            if (Math.abs(castlePaths$3[1] - self.me.y) == 1) {
                return self.move(0, -1);
            }

        }

        var nexStep = get_next_step_astar_turn([self.me.x, self.me.y], castlePaths$3, self.map, currentPath$5.concat(get_visible_robots_list(visible)), 2);
        var movex = nexStep[0] - self.me.x;
        var movey = nexStep[1] - self.me.y;

        stepCounter$3++;
        return self.move(movex, movey);
    }

    return;

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
    } else if (this.me.unit === SPECS.PILGRIM) {
      return pilgrim.takeTurn(this);
    } else if (this.me.unit === SPECS.CRUSADER) {
      return crusader.takeTurn(this);
    } else if (this.me.unit === SPECS.PREACHER) {
      return preacher.takeTurn(this);
    } else if (this.me.unit === SPECS.CHURCH) {
      return church.takeTurn(this);
    } else if (this.me.unit === SPECS.CASTLE) {
      //this.myType = castle;
      return castle.takeTurn(this);
    }


  }
}

var robot = new MyRobot();
var robot = new MyRobot();
