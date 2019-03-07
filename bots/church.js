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
var prime =0;
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
        castle_loc.x = self.me.x;
        castle_loc.y = self.me.y;
        
        var karbonite = resource.get_resource_nodes(self.getKarboniteMap());
        var fuel = resource.get_resource_nodes(self.getFuelMap());
        resource_list = karbonite.concat(fuel);
        // Checks for resources in a 4 r^2 range
        var nearby_nodes = resource.find_nearby_nodes(castle_loc, resource_list, visible, 4);
        map = self.getPassableMap();
         prime = movement.get_random_from_list([5,7,11,13]);
        pilgrimCount = nearby_nodes.length - 1;
        nearbyNodeCount = nearby_nodes.length;
        //self.log(pilgrimCount);
    }
    // This is to check to see if we need to replace any pilgrims
    // if (self.step % 50 === 49){
    //   var visible = self.getVisibleRobots(); 
    //   var tempCount = resource.get_number_of_units(visible, 2);
    //   pilgrimCount = nearbyNodeCount - tempCount;
    //   self.log("New pilgrim count!" + pilgrimCount);
    // }

    if (self.step % 10 == 0 && pilgrimCount > 0 && self.karbonite >= 10*3 && self.fuel >= 50 + 400) {
       // self.log("Building a pilgrim at " + (self.me.x + 1) + ", " + (self.me.y + 1));
        pilgrimCount--;
        var visible = self.getVisibleRobots();
        var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, resource_list, self);
        var buildPlace = [build_loc.x, build_loc.y];
        return self.buildUnit(SPECS.PILGRIM, buildPlace[0], buildPlace[1]);

    }
    if (  self.step >0 &&  self.step % prime == 0  && pilgrimCount === 0 && self.karbonite >= 25*3 && self.fuel >= 50 + 500) {
      // self.log("building prophet");
       //self.log(castle_loc);
       //self.log(visible + "");
        var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, self);
        buildPlace = [build_loc.x, build_loc.y];
         return self.buildUnit(Math.floor(Math.random() * (4 - 3 + 1) ) + 3, buildPlace[0], buildPlace[1]);
    }

};

    export default church;