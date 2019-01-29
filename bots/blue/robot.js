import { BCAbstractRobot, SPECS } from 'battlecode';
import * as resource from './resource.js';
import * as combat from './combat.js';
import pilgrim from './pilgrim.js';

var step = -1;
<<<<<<< Updated upstream

class MyRobot extends BCAbstractRobot {
    constructor() {
        super();
        this.fuel_cap = 100;
        this.karb_cap = 20;
        this.pilgrim_cap;
        this.num_pilgrims = 0;
        this.game_map = [];
        this.karb_locations = [];
        this.fuel_locations = [];
        this.enemies = [];

    
    }
    turn() {
        step++;

        // This is to initialize our class variables on the first turn
        if (step === 0) {

            // We need to create a game map that will keep track of all units
            // and impassable terrain
            this.game_map = this.getPassableMap();
            // This section creates a list of karbonite nodes
            var karb_map = this.getKarboniteMap();
            this.karb_locations = resource.get_resource_nodes(karb_map);

            //This will create a list of fuel nodes
            var fuel_map = this.getFuelMap();
            this.fuel_locations = resource.get_resource_nodes(fuel_map);

            // Creating a pilgrim cap
            this.pilgrim_cap = 10;
        }


        if (this.me.unit === SPECS.CRUSADER) {
            // this.log("Crusader health: " + this.me.health);
            var curr_loc = {'x': this.me.x, 'y':this.me.y};
            var visible = this.getVisibleRobots();

            // Check for a nearby enemy
            this.enemies = combat.get_visible_enemies(this.me.team, visible);
            if (this.enemies.length !== 0){
                this.log("We see an enemy!");
                var target = resource.find_nearest_node(curr_loc, this.enemies);
                //Check if in range
                var dist = resource.calculate_distance(curr_loc, target);
                if (dist <= 4){
                    this.log("Attacking enemy!");
                    var attack = combat.get_relative_position(curr_loc, target);
                    return this.attack(attack.x, attack.y);                }
            }
            const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
        }

        if (this.me.unit === SPECS.PILGRIM) {
            var curr_loc = {'x': this.me.x, 'y':this.me.y};
            var visible = this.getVisibleRobots();

            // Find nearest karbonite
            var nearest_karb = resource.find_nearest_node(curr_loc, this.karb_locations);
            // Find nearest fuel
            var nearest_fuel = resource.find_nearest_node(curr_loc, this.fuel_locations);

            if (this.me.fuel !== this.fuel_cap && this.me.karbonite !== this.karb_cap){
                if (curr_loc.x === nearest_fuel.x && curr_loc.y === nearest_fuel.y || curr_loc.x === 
                    nearest_karb.x && curr_loc.y === nearest_karb.y) {
                        console.log("I am mining!");
                        this.log("I am carrying " + this.me.fuel + " fuel, and " + this.me.karbonite);
                        return this.mine();
                }

                // Moves randomly
                if (nearest_karb && this.me.fuel === 0 || this.me.karbonite === 0) {
                    const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                    const choice = choices[Math.floor(Math.random()*choices.length)]
                    return this.move(...choice);
                }
            }
            // If we're full we need to return to base
            else {
                this.log("I am full! Looking for nearest castle...");
                var nearest_castle = resource.find_nearest_unit(curr_loc, visible, 0);
                this.log("Nearest castle is at (" + nearest_castle.x + ", " + nearest_castle.y +")");
                var dist = resource.calculate_distance(curr_loc, nearest_castle);
                var move_orders = resource.calculate_move(curr_loc, nearest_castle);
                this.log("Distance is : " +  dist);
                if (dist > 1) {
                    return this.move(move_orders.x, move_orders.y);
                } else {
                    this.log("I am unloading resources");
                    var dx = nearest_castle.x - curr_loc.x;
                    var dy = nearest_castle.y - curr_loc.y;
                    return this.give(dx, dy, this.me.karbonite, this.me.fuel);
                }
            }
=======
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths
var pilgrimCount = 0;
var castleLocs = [];


class MyRobot extends BCAbstractRobot {

  turn() {
    step++;

    if (this.me.unit === SPECS.CRUSADER) {
      if (step === 0) {
        //i know on creation I will be x+1,y+1 away from castle as per code below
        ////this.log(this.fuel_map);
        castlePaths = resource.find_possible_castle_locations([this.me.x - 1, this.me.y - 1], this.map, this.fuel_map);
        //this.log(["me at: " + this.me.x,this.me.y]);
        //this.log("castle paths: ");
        //this.log(castlePaths);
        ////this.log(this.map);
        //path = movement.find_path_to_coordinate([this.me.x-1,this.me.y-1],castlePaths,this.map,this.me);
        ////this.log("chosen path: " );
        ////this.log(path);
        stepCounter = 0;
        ////this.log(path);
      }
      // //this.log("Crusader health: " + this.me.health);
      //const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
      //const choice = choices[Math.floor(Math.random()*choices.length)]
      var visible = this.getVisibleRobots();
      var enemies = combat.get_visible_enemies(this.me.team, visible);
      var curr_loc = { 'x': this.me.x, 'y': this.me.y };
      if (enemies.length !== 0) {
        //this.log("We see an enemy!");
        var target = resource.find_nearest_node(curr_loc, enemies);
        //Check if in range
        var dist = movement.get_distance([curr_loc.x, curr_loc.y], [target.x, target.y]);
        if (dist <= 4) {
          //this.log("Attacking enemy!");
          var attack = combat.get_relative_position(curr_loc, target);
          return this.attack(attack.x, attack.y);
>>>>>>> Stashed changes
        }
      }

      currentPath[stepCounter] = [this.me.x, this.me.y];
      if (stepCounter == 0) {
        stepCounter++;
        if (Math.abs(castlePaths[0] - this.me.x) == 1) {
          return this.move(-1, 0);
        }
        if (Math.abs(castlePaths[1] - this.me.y) == 1) {
          return this.move(0, -1);
        }

      }
      ////this.log("me : " + this.me.x + "," +this.me.y);
      ////this.log("cP " + castlePaths);
      var nexStep = movement.get_next_step([this.me.x, this.me.y], castlePaths, this.map, currentPath.concat(movement.get_visible_robots_list(visible)), 3);
      var movex = nexStep[0] - this.me.x;
      var movey = nexStep[1] - this.me.y;
      //this.log("stepCounter : " + stepCounter);
      //this.log("location : " + this.me.x + "," +this.me.y);
      //this.log("movement : " + movex + ";" + movey);
      stepCounter++;
      return this.move(movex, movey);

<<<<<<< Updated upstream
        else if (this.me.unit === SPECS.CASTLE) {
            if (step % 12) {
                this.log("Building a crusader at " + (this.me.x+1) + ", " + (this.me.y+1));
                return this.buildUnit(SPECS.CRUSADER, 1, 1);
            }
            if (step % 10 && this.num_pilgrims < this.pilgrim_cap) {
                this.log("Building a pilgrim at " + (this.me.x+1) + ", " + (this.me.y+1));
                this.num_pilgrims++;
                this.log("There are now: " + this.num_pilgrims + " pilgrims.")
                return this.buildUnit(SPECS.PILGRIM, 1, 1);
            } else {
                return // this.log("Castle health: " + this.me.health);
            }
=======
      /*if(stepCounter < path.length){
         var movex = path[stepCounter][0] - this.me.x;
         var movey =  path[stepCounter][1] - this.me.y;
         
         //this.log("stepCounter : " + stepCounter);
         //this.log("location : " + [this.me.x,this.me.y]);
         //this.log("movement : " + movex + ";" + movey);
         stepCounter++;
         return this.move(movex,movey);
       }else{
         return
       }*/
      return;
      //return this.move(path[stepCounter][1],);
    }

    else if (this.me.unit === SPECS.CASTLE) {
      if (step % 5 === 0 && pilgrimCount < 3) {
        //  this.log("Building a pilgrim at " + (this.me.x+1) + ", " + (this.me.y+1));
        pilgrimCount++;
        this.log("Pilgrim count is " + pilgrimCount);
        return this.buildUnit(SPECS.PILGRIM, 1, 1);
      }
      if (step % 5 === 1) {
        //this.log("Building a crusader at " + (this.me.x+1) + ", " + (this.me.y+1));
        return this.buildUnit(SPECS.CRUSADER, 1, 1);
      } else {
        castleLocs.push({ x: this.me.x, y: this.me.y });
        return // //this.log("Castle health: " + this.me.health);
      }
    } else if (this.me.unit === SPECS.PILGRIM) {
      var curr_loc = { 'x': this.me.x, 'y': this.me.y };
      var visible = this.getVisibleRobots();
      var karbonite = resource.get_resource_nodes(this.getKarboniteMap());
      var fuel = resource.get_resource_nodes(this.getFuelMap());
      var resources = karbonite.concat(fuel);
      karbonite = resource.update_nodes(curr_loc, resources, visible);


      var nearest_karb = resource.find_nearest_unoccupied_node(curr_loc, resources);
      // this.log("(" + nearest_karb.x + "," + nearest_karb.y+ ")");

      if (this.me.karbonite !== 20 && this.me.fuel !== 100) {
        if (curr_loc.x === nearest_karb.x && curr_loc.y === nearest_karb.y) {
          this.log("I am mining!");
          //this.log("I am carrying " + this.me.fuel + " fuel, and " + this.me.karbonite);
          return this.mine();
        }
        var nexStep = movement.get_next_step([this.me.x, this.me.y], [nearest_karb.x, nearest_karb.y], this.map, movement.get_visible_robots_list(visible), 2);
        var movex = nexStep[0] - this.me.x;
        var movey = nexStep[1] - this.me.y;
        //this.log("location : " + this.me.x + "," +this.me.y);
        //this.log("movement : " + movex + ";" + movey);
        return this.move(movex, movey);
      } else {
        this.log("is castle locs empty? " + castleLocs.length);
        //this.log("I am full! Looking for nearest castle...");
        var nearest_castle = resource.find_nearest_unit(curr_loc, visible, 0);
        //this.log("Nearest castle is at (" + nearest_castle.x + ", " + nearest_castle.y +")");
        var dist = movement.get_distance([this.me.x, this.me.y], [nearest_castle.x, nearest_castle.y]);
        if (dist <= Math.sqrt(2)) {
          //this.log("I am unloading resources");
          var dx = nearest_castle.x - curr_loc.x;
          var dy = nearest_castle.y - curr_loc.y;
          return this.give(dx, dy, this.me.karbonite, this.me.fuel);
>>>>>>> Stashed changes
        }
        var nexStep = movement.get_next_step([this.me.x, this.me.y], [nearest_castle.x, nearest_castle.y], this.map, movement.get_visible_robots_list(visible), 2);
        var movex = nexStep[0] - this.me.x;
        var movey = nexStep[1] - this.me.y;
        //this.log("location : " + this.me.x + "," +this.me.y);
        //this.log("movement : " + movex + ";" + movey);
        return this.move(movex, movey);
      }

    }

  }
}

var robot = new MyRobot();
