import { BCAbstractRobot, SPECS } from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';
import * as build from './build.js';
import * as movement from './movement.js';

const church = {};

var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths
var pilgrimCount = 0;
var castle_loc = { x: 0, y: 0 };
var map = [];
var resource_list;
var nearbyNodeCount = 0;

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


    // Initialize to figure out how many pilgrims to build
    if (self.step < 1) {
        castle_loc.x = self.me.x;
        castle_loc.y = self.me.y;
        var visible = self.getVisibleRobots();
        var karbonite = resource.get_resource_nodes(self.getKarboniteMap());
        var fuel = resource.get_resource_nodes(self.getFuelMap());
        resource_list = karbonite.concat(fuel);
        // Checks for resources in a 4 r^2 range
        var nearby_nodes = resource.find_nearby_nodes(castle_loc, resource_list, visible, 8);
        map = self.getPassableMap();

        // Adjusts pilgrim count if there are already nearby pilgrims
        for (var i = 0; i < visible.length; i++){
            if (visible[i].unit === 2 && movement.get_distance([castle_loc.x, castle_loc.y], [visible[i].x, visible[i].y]) <= 10){
                pilgrimCount--;
            }
            self.log("Church: nearby pilgrims");
            self.log(pilgrimCount);
        }
        pilgrimCount += nearby_nodes.length;
        nearbyNodeCount = nearby_nodes.length;
        self.log(pilgrimCount);
    }
    // This is to check to see if we need to replace any pilgrims
    // if (self.step % 50 === 49){
    //   var visible = self.getVisibleRobots(); 
    //   var tempCount = resource.get_number_of_units(visible, 2);
    //   pilgrimCount = nearbyNodeCount - tempCount;
    //   self.log("New pilgrim count!" + pilgrimCount);
    // }

    if (self.step % 10 && pilgrimCount >= 0 && self.karbonite >= 10) {
        self.log("Building a pilgrim at " + (self.me.x + 1) + ", " + (self.me.y + 1));
        pilgrimCount--;
        var visible = self.getVisibleRobots();
        var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, resource_list, self);
        var buildPlace = [build_loc.x, build_loc.y];
        return self.buildUnit(SPECS.PILGRIM, buildPlace[0], buildPlace[1]);

    }
    if (self.step > 50) {
        if (self.step % 6 === 1 && pilgrimCount <= 0 && self.karbonite >= 30) {
            // self.log("Building a crusader at " + (self.me.x+1) + ", " + (self.me.y+1));
            var visible = self.getVisibleRobots();
            var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, resource_list, self);
            buildPlace = [build_loc.x, build_loc.y];
            return self.buildUnit(SPECS.PROPHET, buildPlace[0], buildPlace[1]);
        }
        if (self.step % 6 === 5 && pilgrimCount <= 0 && self.karbonite >= 25) {
            var visible = self.getVisibleRobots();
            var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, resource_list, self);
            buildPlace = [build_loc.x, build_loc.y];
            return self.buildUnit(SPECS.PROPHET, buildPlace[0], buildPlace[1]);

        }
    } else {
        if (self.step % 10 === 1 && pilgrimCount <= 0 && self.karbonite >= 50) {
            var visible = self.getVisibleRobots();
            var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, resource_list, self);
            buildPlace = [build_loc.x, build_loc.y];
            return self.buildUnit(SPECS.PROPHET, buildPlace[0], buildPlace[1]);
        }
        else {
            var visible = self.getVisibleRobots();
            var enemies = combat.get_visible_enemies(self.me.team, visible);
            var curr_loc = { 'x': self.me.x, 'y': self.me.y };
            if (enemies.length !== 0) {
                //self.log("We see an enemy!");
                var target = resource.find_nearest_node(curr_loc, enemies);
                //Check if in range
                var dist = movement.get_distance([curr_loc.x, curr_loc.y], [target.x, target.y]);
                if (dist <= 8) {
                    //self.log("Attacking enemy!");
                    var attack = combat.get_relative_position(curr_loc, target);
                    return self.attack(attack.x, attack.y);
                }
            }
        }
    }

};

    export default church;