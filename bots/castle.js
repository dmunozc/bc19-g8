import { BCAbstractRobot, SPECS } from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';
import * as build from './build.js';
import * as movement from './movement.js';
import * as message from './message.js';
import pilgrim from './pilgrim.js';

const castle = {};
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths
var pilgrimCount = 0;
var maxPilgrims = 0;
var castle_loc = { x: 0, y: 0 };
var map = [];
var friendly_castles = [];
var resource_list;
var enemy_castles = [];
var numCastles = 0;
var resource_clusters = [];
var nearbyNodeCount = 0;

castle.takeTurn = (self) => {
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
        self.log(resource_list);
        // Checks for resources in a 4 r^2 range
        var nearby_nodes = resource.find_nearby_nodes(castle_loc, resource_list, visible, 8);
        map = self.getPassableMap();
        // Build 1 more pilgrim so it can go off and build a church

        numCastles = self.getVisibleRobots().length;

        friendly_castles.push({"x": self.me.x, "y": self.me.y});
        var enemy = resource.find_possible_castle_locations([self.me.x, self.me.y], self.map, self.getKarboniteMap());
        enemy_castles.push({"x": enemy[0], "y": enemy[1]});
        self.log(friendly_castles);
        self.log(enemy_castles);
        var temp_cluster = resource.find_clusters(resource_list, friendly_castles, enemy_castles);
        resource_clusters = resource.update_nodes(castle_loc, temp_cluster, visible);
        self.log(resource_clusters);
        pilgrimCount = nearby_nodes.length + Math.floor(resource_clusters.length/numCastles);
        self.log(pilgrimCount);
        maxPilgrims = pilgrimCount;
        nearbyNodeCount = nearby_nodes.length;
        self.log(pilgrimCount);
        // self.signal(1, Math.pow(self.getPassableMap().length, 2));
        // self.castleTalk(1);
        numCastles--;

    }

    // Assigns pilgrims to clusters
    var visible = self.getVisibleRobots();
    for(var i = 0; i < visible.length; i++){
        if (visible[i].castle_talk === 10){
            self.log("pilgrim needs loc");
            if (visible[i].x){
                self.log("I am going to transmit to:");
                self.log(visible[i]);
                var reset = false;
                if (resource_clusters.length === 1){
                    reset = true;
                }
                var dest = resource_clusters[0];
                var dist = Math.ceil(movement.get_distance([castle_loc.x, castle_loc.y], [visible[i].x, visible[i].y]));
                self.log("Distance to transmit is : " + dist)
                message.transmit_location(self, dest, Math.pow(dist, 2));
                self.log(resource_clusters);
                resource_clusters.splice(0, 1);
                if (reset){
                    resource_clusters = resource.find_clusters(resource_list, friendly_castles, enemy_castles);
                }
                self.log("Deleted a resource cluster");
                self.log(resource_clusters);
            }
        }
        // A pilgrim needs to build a church, so let's skip some turns for resources
        if (visible[i].castle_talk === 11){
            return;
        }
    }


    // // Sending a signal to determine number of castles
    // if (self.step <= numCastles){
    //     self.signal(1, Math.pow(self.getPassableMap().length, 2));
    //     self.castleTalk(1);
    // }

    // // We can add to friendly castle array
    // if(self.step > 0 && numCastles != 0){
    //     self.castleTalk(1); 
    //     var visible = self.getVisibleRobots();
    //     self.log(visible);
    //     for (var i = 0; i < visible.length; i++){
    //         if (visible[i].castle_talk === 1 && visible[i].x != self.me.x && visible[i].y != self.me.y){
    //             friendly_castles.push({"x": visible[i].x, "y":visible[i].y});
    //             numCastles--;
    //         } 
    //     }
    //     self.log("Friendly castles");
    //     self.log(friendly_castles);
    // }
    // // We can calculate enemy castles now
    // if (numCastles === 0 && enemy_castles.length < friendly_castles.length){
    //     for (var i = 0; i < friendly_castles.length; i++){
    //         var enemy = resource.find_possible_castle_locations([friendly_castles[i].x, friendly_castles[i].y], self.map, self.getKarboniteMap());
    //         enemy_castles.push({"x":enemy[0], "y":enemy[1]});
    //     }
    //     // This just arranges by distance (might not be needed)
    //     enemy_castles = resource.update_nodes(castle_loc, enemy_castles, []);
    //     self.log("Enemy castles");
    //     self.log(enemy_castles);
    // }
    // // We can find the clusters now
    // if (enemy_castles.length === friendly_castles.length && resource_clusters.length < 1){
    //     resource_clusters = resource.find_clusters(resource_list, friendly_castles, enemy_castles);
    //     self.log("Resource clusters");
    //     self.log(resource_clusters);
    //     maxPilgrims = maxPilgrims + Math.ceil(resource_clusters.length/friendly_castles.length);
    //     self.log("Max pilgrims: " + maxPilgrims);
    // }

    if (self.step % 100 === 99){
        // we should adjust number of pilgrims periodically
        var count = 0;
        self.log("Updating pilgrims");
        self.log(visible);
        for (var i = 0; i < visible.length; i++){
            var sig = visible[i].castle_talk;
            // These are all the pilgrim castle talk signals
            if (sig === 2 || sig === 10 || sig === 11){
                count++;
            }
        }
        pilgrimCount = maxPilgrims - count;
        if (pilgrimCount < 0){
            pilgrimCount = 0;
        }
        self.log("***************************************");
        self.log("Pilgrim count updated: " + pilgrimCount);
        self.log("***************************************");

    }

    /***************** BUILD SECTION  **********************/

    if (self.step % 10 === 0 && pilgrimCount !== 0 && self.karbonite >= (10 * friendly_castles.length) && self.fuel >= (50 * friendly_castles.length)) {
        self.log("Building a pilgrim at " + (self.me.x + 1) + ", " + (self.me.y + 1));
        pilgrimCount--;
        var visible = self.getVisibleRobots();
        var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, resource_list, self);
        var buildPlace = [build_loc.x, build_loc.y];
        return self.buildUnit(SPECS.PILGRIM, buildPlace[0], buildPlace[1]);

    }
    if (self.step > 50) {
        if (self.step % 6 === 1 && pilgrimCount === 0 && self.karbonite >= 60) {
            // self.log("Building a crusader at " + (self.me.x+1) + ", " + (self.me.y+1));
            var visible = self.getVisibleRobots();
            var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, resource_list, self);
            buildPlace = [build_loc.x, build_loc.y];
            return self.buildUnit(SPECS.CRUSADER, buildPlace[0], buildPlace[1]);
        }
        // if (self.step % 6 === 5 && pilgrimCount === 0 && self.karbonite >= 50) {
        //     var visible = self.getVisibleRobots();
        //     var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, self);
        //     buildPlace = [build_loc.x, build_loc.y];
        //     return self.buildUnit(SPECS.CRUSADER, buildPlace[0], buildPlace[1]);

        // }
    } else {
        if (self.step % 10 === 1 && pilgrimCount === 0 && self.karbonite >= 50) {
            var visible = self.getVisibleRobots();
            var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, resource_list, self);
            buildPlace = [build_loc.x, build_loc.y];
            return self.buildUnit(SPECS.CRUSADER, buildPlace[0], buildPlace[1]);
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


export default castle;