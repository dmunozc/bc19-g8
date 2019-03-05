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
var prime = 0;
var master = false;
var foundMaster = false;
var MASTER = 13;
var HEARTBEAT = 213;
var ATTACK_INCOMING = 215;
var locSentCounter = 0;
var minimumFuel = 150;
var minimumKarb = 25;
var friendlyCastlesNumbered = 0;
var possiblePrimes = [2,3,5];
var canBuild = true;
var canFuel = true;
var oldPrime = -1;
var beingAttack = false;
castle.takeTurn = (self) => {


     var visible = self.getVisibleRobots();
     //self.log(enemy_castles);
     //self.log(self.step);
     var castleMasterSignal = visible.filter(robot => robot.castle_talk == MASTER);
     var castleAttackSignal = visible.filter(robot => robot.castle_talk == ATTACK_INCOMING && robot.id != self.id);
     var enemyRobots = visible.filter(robot => robot.team != self.me.team);
     //self.log(castleMasterSignal);
    // Initialize to figure out how many pilgrims to build
    if (self.step <= 0) {
      self.log("start");
        castle_loc.x = self.me.x;
        castle_loc.y = self.me.y;
        var karbonite = resource.get_resource_nodes(self.getKarboniteMap());
        var fuel = resource.get_resource_nodes(self.getFuelMap());
        resource_list = karbonite.concat(fuel);
        //self.log(resource_list);
        // Checks for resources in a 4 r^2 range
        var nearby_nodes = resource.find_nearby_nodes(castle_loc, resource_list, visible, 8);
        map = self.getPassableMap();
        // Build 1 more pilgrim so it can go off and build a church
        pilgrimCount = nearby_nodes.length;
        nearbyNodeCount = nearby_nodes.length;
        //self.log(pilgrimCount);
        numCastles = visible.length;
        
        friendly_castles.push({"x": self.me.x, "y": self.me.y});
        //var enemy = resource.find_possible_castle_locations([self.me.x, self.me.y], self.map, self.getKarboniteMap());
        //enemy_castles.push({"x": enemy[0], "y": enemy[1]});
        //self.log(friendly_castles);
        //self.log(enemy_castles);
        var temp_cluster = resource.find_clusters(resource_list, friendly_castles, enemy_castles);
        resource_clusters = resource.update_nodes(castle_loc, temp_cluster, visible);
        //self.log(resource_clusters);
        pilgrimCount = nearby_nodes.length + Math.floor(resource_clusters.length/numCastles) - numCastles;
        //self.log(pilgrimCount);
        maxPilgrims = pilgrimCount;
        nearbyNodeCount = nearby_nodes.length;
        //self.log(pilgrimCount);
        // self.signal(1, Math.pow(self.getPassableMap().length, 2));
        // self.castleTalk(1);
        numCastles--;
        if(numCastles == 0){
          prime = 1;
          oldPrime = prime;
          foundMaster = true;
        }else{
          prime = movement.get_random_from_list([5,7,11,13]);
          oldPrime = prime;
        }
        //self.log(numCastles);
        
        //self.log(visible);
    }
    
   // self.log("here 97");
    // Assigns pilgrims to clusters
    for(var i = 0; i < visible.length; i++){
        if (visible[i].castle_talk === 10){
            //self.log("pilgrim needs loc");
            if (visible[i].x){
                //self.log("I am going to transmit to:");
                //self.log(visible[i]);
                var reset = false;
                if (resource_clusters.length === 1){
                    reset = true;
                }
                var dest = resource_clusters[0];
                var dist = Math.ceil(movement.get_distance([castle_loc.x, castle_loc.y], [visible[i].x, visible[i].y]));
                //self.log("Distance to transmit is : " + dist)
                message.transmit_location(self, dest, Math.pow(dist, 2));
                //self.log(resource_clusters);
                resource_clusters.splice(0, 1);
                if (reset){
                    resource_clusters = resource.find_clusters(resource_list, friendly_castles, enemy_castles);
                }
                //self.log("Deleted a resource cluster");
                //self.log(resource_clusters);
            }
        }
        // A pilgrim needs to build a church, so let's skip some turns for resources
       /* if (visible[i].castle_talk === 11){
            return;
        }*/
    }

    //self.log("here 128");
    // // Sending a signal to determine number of castles
    if (self.step == 0 && numCastles != 0){
      //self.log("sending signal heartbeat");
       self.signal(1, Math.pow(self.getPassableMap().length, 2));
       self.castleTalk(1);
    }
 // self.log("here 135");
    // // We can add to friendly castle array
    if(numCastles != 0){
      //self.log(self.step + "  trying to get castles");
        //self.castleTalk(1); 
        var visible = self.getVisibleRobots();
        //self.log(visible);
        //self.log(visible);
        for (var i = 0; i < visible.length; i++){
            if (visible[i].castle_talk === 1 && visible[i].x != self.me.x && visible[i].y != self.me.y){
                friendly_castles.push({"x": visible[i].x, "y":visible[i].y});
                numCastles--;
            } 
        }
        //self.log("Friendly castles");
        //self.log(friendly_castles);
    }
    // // We can calculate enemy castles now
    if (numCastles == 0 && enemy_castles.length < friendly_castles.length){
        for (var i = 0; i < friendly_castles.length; i++){
            var enemy = resource.find_possible_castle_locations([friendly_castles[i].x, friendly_castles[i].y], self.map, self.getKarboniteMap());
            enemy_castles.push({"x":enemy[0], "y":enemy[1]});
        }
        // This just arranges by distance (might not be needed)
        enemy_castles = resource.update_nodes(castle_loc, enemy_castles, []);
        //self.log("Enemy castles");
        //self.log(enemy_castles);
    }
    // We can find the clusters now
    if (enemy_castles.length === friendly_castles.length && resource_clusters.length < 1){
        resource_clusters = resource.find_clusters(resource_list, friendly_castles, enemy_castles);
        //self.log("Resource clusters");
        //self.log(resource_clusters);
        maxPilgrims = maxPilgrims + Math.ceil(resource_clusters.length/friendly_castles.length);
        self.log("updated pilgrims  " + maxPilgrims);
        //self.log("Max pilgrims: " + maxPilgrims);
    }
   // self.log(self.step + "  step  " + prime);
    /*self.log("numCastles  " + numCastles);
    self.log("friendlyCastlesNumbered   " + friendlyCastlesNumbered);
    self.log("friendly_castles.legnth  "  +friendly_castles.length); 
    self.log(foundMaster);*/
   // self.log("here 176");
    if(foundMaster == true && prime != 1){
      //self.log("sending heartbeat  "  + self.step);
      self.castleTalk(HEARTBEAT);
      var castleHeartbeatSignal = visible.filter(robot => robot.castle_talk >= HEARTBEAT && robot.id != self.id);
      //self.log("castleHeartbeatSignal");
      //self.log(castleHeartbeatSignal);
      if(self.step > 50 && castleHeartbeatSignal.length == 0){
        self.log("*********************************************************************************all castles eliminated, i am the only one");
        prime = 1;
        oldPrime = prime;
      }
    }
    if(foundMaster == false && numCastles == 0 && friendlyCastlesNumbered == friendly_castles.length-1){
      prime = possiblePrimes[friendlyCastlesNumbered];
      oldPrime = prime;
      self.log("my prime  " + prime);
      foundMaster = true;
    }
    if (foundMaster == false && numCastles == 0 && castleMasterSignal.length > 0){
      self.log("found other castle wanting to be master");
      self.log(castleMasterSignal);
      friendlyCastlesNumbered += castleMasterSignal.length;
      //foundMaster = true;
    }
    if(foundMaster == false && numCastles == 0 && friendlyCastlesNumbered < friendly_castles.length &&self.step >0 &&self.step % prime == 0){
      self.castleTalk(MASTER);
      self.log("i am master   " + prime + "   " + self.step);
      prime = possiblePrimes[friendlyCastlesNumbered];
      oldPrime = prime;
      self.log("my prime  " + prime);
      foundMaster = true;
    }
    
    if(enemyRobots.length >= 2){
      self.log(self.step +  "--------------------------------------------------------------------------i am being attacked, need all resources");
      self.castleTalk(ATTACK_INCOMING);
      oldPrime = prime;
      prime =1;
      canBuild = true;
      beingAttack = true;
    }else{
      if(castleAttackSignal.length > 0){
        self.log(self.step +  "--------------------------------------------------------------------------somebody is being attacked, they need all resources");
        canBuild = false;
      }else{
        if(beingAttack == true){
          self.log("sending herabeat after attacK");
          beingAttack = false;
          self.castleTalk(HEARTBEAT);
          prime = possiblePrimes[friendlyCastlesNumbered];
        }
        canBuild = true;
        
        
      }
      
      
      
    }
    
    

  /*  if (self.step % 100 === 99){
        // we should adjust number of pilgrims periodically
        var count = 0;
        //self.log("Updating pilgrims");
        //self.log(visible);

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
        //self.log("***************************************");
        //self.log("Pilgrim count updated: " + pilgrimCount);
        //self.log("***************************************");

    }*/

    /***************** BUILD SECTION  **********************/
//self.log("pilgrimCount   " + pilgrimCount);
    if (self.step > 0 && self.step % prime === 0 && pilgrimCount >= 0 && self.karbonite >= (10 * friendly_castles.length + minimumKarb) && self.fuel >= (50 * friendly_castles.length + minimumFuel) && canBuild == true) {
        // self.log("Building a pilgrim at " + (self.me.x + 1) + ", " + (self.me.y + 1));
        pilgrimCount--;
        var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, resource_list, self);
        return self.buildUnit(SPECS.PILGRIM, build_loc.x, build_loc.y);

    }
    
     if((self.step <= 300+ enemy_castles.length  && self.step > 300)||
          (self.step <= 625+ enemy_castles.length && self.step >625) ||
          (self.step <= 950+ enemy_castles.length && self.step > 950) ){
        //self.log("trying to send message");
        //self.log([enemy_castles[0].x,enemy_castles[0].y]);
        var toSend = locSentCounter % enemy_castles.length;
        //self.log(enemy_castles.length);
        //self.log(enemy_castles[toSend]);
        self.signal(message.encode_attack([enemy_castles[toSend].x,enemy_castles[toSend].y]), Math.pow(7, 2));
        locSentCounter++;
      }
    /*if(enemy_castles.length == 1){
      prime = 1;
    }*/
      //self.log("canBuild    "   + canBuild + "   prime   " + prime);
    if ( self.step >0 &&  self.step % prime == 0 && pilgrimCount <=0 && self.karbonite >= (25 * friendly_castles.length + minimumKarb) && (50 * friendly_castles.length + minimumFuel) && canBuild == true) {
       //self.log("buidlattack unit");
        var build_loc = build.find_location_to_build_unit(castle_loc, map, visible, self);
        var buildPlace = [build_loc.x, build_loc.y];
         return self.buildUnit(Math.floor(Math.random() * (4 - 3 + 1) ) + 3, buildPlace[0], buildPlace[1]);
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