import {BCAbstractRobot, SPECS} from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';

import * as movement from './movement.js';
import * as message from './message.js';


const prophet = {};
var currentPath = [];
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
    karbPaths = movement.resource_map_to_coor_list(self.karbonite_map,self);
    fuelPaths = movement.resource_map_to_coor_list(self.fuel_map,self);
    var  temp = visible.filter(robot => (robot.unit == 0 || robot.unit == 1));
    closestBuilding = [temp[0].x, temp[0].y];
  }
  //always check for attacking first to defend properly
  var enemies = combat.get_visible_enemies(self.me.team, visible);
  //self.log(enemies);
  if (enemies.length !== 0){
    //self.log("We see an enemy!");
    var target = resource.find_nearest_node(curr_loc, enemies);
    //self.lof(target);
    //Check if in range
    var dist = movement.get_distance([curr_loc.x,curr_loc.y], [target.x,target.y]);
    if (dist <= 16 && dist >= 4){
      //self.log("Attacking enemy!: " + dist);
      //self.log(curr_loc);
      //self.log(target)
      //self.log("ATTACL");
      //self.log(target);
      var attack = combat.get_relative_position(curr_loc, target);
      
     // self.log(attack);
      return self.attack(attack.x, attack.y);      
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
    var code = availableSignals[0].signal &  message.ATTACK;
    //self.log("my code is: " +code);
    if(code == message.ATTACK){
      //self.log("//////////////////////////////////////////////prophet received attack code");
     // self.log(availableSignals);
      newTarget = true;
      //self.log(availableSignals);
      var loc = message.decode_location(availableSignals[0].signal);
      if(movement.check_if_coor_in_path(loc,targetLocations) == false){
        targetLocations.push(loc);
        currentPath = [];
        //self.log(targetLocations);
        //self.log(message.decode_location(availableSignals[0].signal));
        self.signal(message.encode_attack(targetLocations[targetCounter]), Math.pow(5,2)/*Math.pow(self.getPassableMap().length, 2)*/);
        //self.log("prophet new attack loc   " );
        //self.log(targetLocations);
      }
    }
  }
  if(newTarget == true){
    //self.log(targetLocations);
    if(movement.get_distance([curr_loc.x,curr_loc.y],targetLocations[targetCounter]) < 4 && targetCounter < (targetLocations.length-1)){
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
      self.signal(message.encode_attack(targetLocations[targetCounter]), Math.pow(20,2)/*Math.pow(self.getPassableMap().length, 2)*/);
      // self.log("prophet new taregt   "  + targetLocations[targetCounter]);
    }
    if(canMove == true){
      //self.log("here");
      var nexStep = movement.get_next_step_astar_fuel([self.me.x,self.me.y],targetLocations[targetCounter],self.map,
        currentPath.concat(movement.get_visible_robots_list(self.getVisibleRobots())),2);
      currentPath.push([self.me.x, self.me.y]);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      
      return self.move(movex,movey);
    }else{
      return;
    }
  }
  
  if(self.step < 2){
    var nexStep = movement.get_next_step_astar_turn([self.me.x,self.me.y],resource.find_possible_castle_locations([self.me.x-1,self.me.y-1],self.map,self.fuel_map),self.map,
    currentPath.concat(movement.get_visible_robots_list(self.getVisibleRobots())),2);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      //self.log("stepCounter : " + stepCounter);
      //self.log("location : " + self.me.x + "," +self.me.y);
      return self.move(movex,movey);
  }
  if(done === false){
    //self.log("done is false");
    //self.log(building[0]);
    var nextStep = movement.get_next_checkerboard_step([self.me.x,self.me.y],self.map,self.getVisibleRobots(),currentPath.concat(karbPaths.concat(fuelPaths)),self);
    if(nextStep[0] == self.me.x && nextStep[1] == self.me.y || movement.get_distance(nextStep, closestBuilding) <= Math.sqrt(8)){
      //need to go somehere
     // self.log("need to go somehere");
      nextStep = movement.get_possible_square_steps_list([self.me.x,self.me.y],self.map);
      var nearRobots = movement.get_visible_robots_list(self.getVisibleRobots());
      var i;
      var current = movement.get_random_from_list(nextStep);
      while(movement.check_if_coor_in_path([current[0] + self.me.x, current[1] + self.me.y], nearRobots.concat(currentPath)) == true){
        
        counter++;
        if (counter >=3){
          return;
        }
        //self.log("in while");
        current = movement.get_random_from_list(nextStep);
        
      }
      
      //self.log("no pass");
      //self.log(current);
      currentPath.push([self.me.x, self.me.y]);
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
    
  }else{
    
  }

};


export default prophet;