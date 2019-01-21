import {BCAbstractRobot, SPECS} from 'battlecode';
import * as resource from './resource.js';
import pilgrim from './pilgrim.js';

var step = -1;

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
    

            // if (this.me.unit === SPECS.CASTLE){
            //     var curr_loc = {'x': this.me.x, 'y':this.me.y};
            //     // this.castle_locations.push(curr_loc);
            //     this.log("I am updating map. Curr_loc: " + curr_loc.x + ", " + curr_loc.y);
            //     this.game_map = resource.update_map(curr_loc, this.game_map, true);
            //     // this.log(this.game_map);

            // }
        }


        if (this.me.unit === SPECS.CRUSADER) {
            // this.log("Crusader health: " + this.me.health);
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
            // this.log ("Fuel: " + this.me.fuel + ". Cap: " + this.fuel_cap);
            // this.log ("Karb: " + this.me.karbonite + ". Cap: " + this.karb_cap);
            if (this.me.fuel !== this.fuel_cap && this.me.karbonite !== this.karb_cap){
                if (curr_loc.x === nearest_fuel.x && curr_loc.y === nearest_fuel.y || curr_loc.x === 
                    nearest_karb.x && curr_loc.y === nearest_karb.y) {
                        console.log("I am mining!");
                        this.log("I am carrying " + this.me.fuel + " fuel, and " + this.me.karbonite);
                        return this.mine();
                }

                // Moves randomly
                if (nearest_karb && this.me.fuel === 0 || this.me.karbonite === 0) {
                    // var move_orders = resource.calculate_move(curr_loc, nearest_fuel);
                    // // this.log("Move orders: " + move_orders.x + ", " + move_orders.y);
                    // return this.move(move_orders.x, move_orders.y);
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
        }

        else if (this.me.unit === SPECS.CASTLE) {
            // if (step < 10) {
            //     this.log("Building a pilgrim at " + (this.me.x+1) + ", " + (this.me.y+1));
            //     return this.buildUnit(pilgrim)
            // }

            if (step % 10 && this.num_pilgrims < this.pilgrim_cap) {
                this.log("Building a pilgrim at " + (this.me.x+1) + ", " + (this.me.y+1));
                this.num_pilgrims++;
                this.log("There are now: " + this.num_pilgrims + " pilgrims.")
                return this.buildUnit(SPECS.PILGRIM, 1, 1);
            } else {
                return // this.log("Castle health: " + this.me.health);
            }
        }

    }
}

var robot = new MyRobot();
