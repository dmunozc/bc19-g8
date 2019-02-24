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
var castle_loc = { x: 0, y: 0 };
var map = [];
var friendly_castles = [];
var enemy_castles = [];
var numCastles = 0;
var nearbyNodeCount = 0;
var prime = 0;
var master = false;
var foundMaster = false;
var MASTER = 13;
var locSentCounter = 0;
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
    
     var visible = self.getVisibleRobots();
     //self.log(enemy_castles);
     //self.log(visible);
     var castleMasterSignal = visible.filter(robot => robot.castle_talk == MASTER);
     //self.log(castleMasterSignal);
    // Initialize to figure out how many pilgrims to build
    if (self.step <= 0) {
        castle_loc.x = self.me.x;
        castle_loc.y = self.me.y;
        var karbonite = resource.get_resource_nodes(self.getKarboniteMap());
        var fuel = resource.get_resource_nodes(self.getFuelMap());
        var resources = karbonite.concat(fuel);
        // self.log(resources);
        // Checks for resources in a 4 r^2 range
        var nearby_nodes = resource.find_nearby_nodes(castle_loc, resources, visible, 4);
        map = self.getPassableMap();
        // Build 1 more pilgrim so it can go off and build a church
        pilgrimCount = nearby_nodes.length;
        nearbyNodeCount = nearby_nodes.length;
        //self.log(pilgrimCount);
        numCastles = visible.length;
        friendly_castles.push({"x": self.me.x, "y": self.me.y});
        self.signal(1, Math.pow(self.getPassableMap().length, 2));
        numCastles--;
        prime = movement.get_random_from_list([5,7,11,13]);
        //self.log(numCastles);
        
        //self.log(visible);
        
    }
    
    if (self.step <= numCastles){
        self.signal(1, Math.pow(self.getPassableMap().length, 2));
        self.castleTalk(1);
    }

    if(self.step >= 1 && numCastles != 0){
        self.castleTalk(1); 
       // self.log(visible);
        for (var i = 0; i < visible.length; i++){
            if (visible[i].castle_talk === 1 && visible[i].x != self.mex && visible[i].y != self.me.y){
                friendly_castles.push({"x": visible[i].x, "y":visible[i].y});
                numCastles--;
            } 
        }
        //self.log(friendly_castles);
    }
    
    if (foundMaster == false && castleMasterSignal.length > 0){
      self.log("found master");
      foundMaster = true;
    }
    if(foundMaster == false && ((self.step+1) % prime == 0) && master == false){
      self.castleTalk(MASTER);
      self.log("i am master");
      master = true;
      foundMaster = true;
    }
    // We can calculate enemy castles now
    if (numCastles === 0 && enemy_castles.length < friendly_castles.length){
      
        for (var i = 0; i < friendly_castles.length; i++){
            var enemy = resource.find_possible_castle_locations([friendly_castles[i].x, friendly_castles[i].y], self.map, self.getKarboniteMap());
            enemy_castles.push({"x":enemy[0], "y":enemy[1]});
        }
        // This just arranges by distance (might not be needed)
        //enemy_castles = resource.update_nodes(castle_loc, enemy_castles, []);
        //self.log(enemy_castles);
        //self.log(enemy_castles);
    }

    if (self.step >= 3 && pilgrimCount !== 0 && self.karbonite >= 10 && self.fuel >= 50) {
        //self.log("Building a pilgrim at " + (self.me.x + 1) + ", " + (self.me.y + 1));
        pilgrimCount--;
        var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, self);
        var buildPlace = [build_loc.x, build_loc.y];
        return self.buildUnit(SPECS.PILGRIM, buildPlace[0], buildPlace[1]);

    }

      if((self.step <= 350+ enemy_castles.length  && self.step > 350)||
          (self.step <= 700+ enemy_castles.length && self.step >700) ||
          (self.step <= 950+ enemy_castles.length && self.step > 950) ){
        //self.log("trying to send message");
        //self.log([enemy_castles[0].x,enemy_castles[0].y]);
        var toSend = locSentCounter % enemy_castles.length;
        //self.log(enemy_castles.length);
        //self.log(enemy_castles[toSend]);
        self.signal(message.encode_attack([enemy_castles[toSend].x,enemy_castles[toSend].y]), Math.pow(Math.ceil(self.getPassableMap().length/ enemy_castles.length), 2));
        locSentCounter++;
      }
    if(enemy_castles.length == 1){
      prime = 1;
    }
    if ( self.step % prime == 0 && pilgrimCount === 0 && self.karbonite >= 25 && self.fuel >= 50) {
       
        var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, self);
        buildPlace = [build_loc.x, build_loc.y];
        if(self.step < 110){
          return self.buildUnit(SPECS.PROPHET, buildPlace[0], buildPlace[1]);
        }else if (self.step < 350){
          return self.buildUnit(SPECS.CRUSADER, buildPlace[0], buildPlace[1]);
        }else if (self.step < 550){
          return self.buildUnit(SPECS.PROPHET, buildPlace[0], buildPlace[1]);
        }else if (self.step < 700){
          return self.buildUnit(SPECS.CRUSADER, buildPlace[0], buildPlace[1]);
        }else if (self.step < 875){
          return self.buildUnit(SPECS.PROPHET, buildPlace[0], buildPlace[1]);
        }else{
          return self.buildUnit(SPECS.CRUSADER, buildPlace[0], buildPlace[1]);
        }
    }
    else {
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
    
};


export default castle;