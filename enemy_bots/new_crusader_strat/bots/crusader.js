import {BCAbstractRobot, SPECS} from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';

import * as movement from './movement.js';
import * as message from './message.js';


const crusader = {};
var currentPath = [];
var done = false;
var fuelPaths = [];
var karbPaths = [];
var closestBuilding ;
var newTarget = false;
var targetLocations = [];
var targetCounter = 0;
var canMove = true;
var enemyBuilding = [];
crusader.takeTurn = (self) => {
  //self.log(self.step + "");
  var nextStep;
  var curr_loc = {'x': self.me.x, 'y':self.me.y};
  var visible = self.getVisibleRobots();
  var counter = 0;
  //self.log(curr_loc);
  //self.log(visible);
  
  if(self.fuel < 500){
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
    enemyBuilding = resource.find_possible_castle_locations(closestBuilding,self.map,self.fuel_map)
  }
  //always check for attacking first to defend properly
  var enemies = combat.get_visible_enemies(self.me.team, visible);
  //self.log(enemies);
  if (enemies.length !== 0){
    //self.log("We see an enemy!");
    var target = resource.find_nearest_node(curr_loc, enemies);
    //self.log(target);
    //Check if in range
    var dist = movement.get_distance([curr_loc.x,curr_loc.y], [target.x,target.y]);
    if (dist < 4){
      //self.log("Attacking enemy!: " + dist);
      //self.log(curr_loc);
      //self.log(target)
      //self.log("ATTACL");
      //self.log(target);
      var attack = combat.get_relative_position(curr_loc, target);
      
     // self.log(attack);
      return self.attack(attack.x, attack.y);      
    }else{
      if (target.unit == 3){
        //self.log("movign towards prophet");
         var nexStep = movement.get_next_step_astar_turn([self.me.x,self.me.y],[target.x,target.y],self.map,[],3);
          var movex = nexStep[0] - self.me.x;
          var movey = nexStep[1] - self.me.y;
          return self.move(movex,movey);
      }
    }                    
  }

  if(true){
    var nexStep = movement.get_next_step_astar_turn([self.me.x,self.me.y],enemyBuilding,self.map,
    currentPath.concat(movement.get_visible_robots_list(self.getVisibleRobots())),3);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      //self.log("stepCounter : " + stepCounter);
      //self.log("location : " + self.me.x + "," +self.me.y);
      return self.move(movex,movey);
  }


};


export default crusader;