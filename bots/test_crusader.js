import { BCAbstractRobot, SPECS } from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';

import * as movement from './movement.js';

const crusader = {};
const prophet = {};
var currentPath = [];
var done = false;
var fuelPaths = [];
var karbPaths = [];
var building ;

crusader.takeTurn = (self) => {
  var nextStep;
  var visible = self.getVisibleRobots();
  //self.log(visible);
   
  if(self.step == 0){
    karbPaths = movement.resource_map_to_coor_list(self.karbonite_map,self);
    fuelPaths = movement.resource_map_to_coor_list(self.fuel_map,self);
    var  temp = visible.filter(robot => (robot.unit == 0 || robot.unit == 1));
      //self.log(temp);
    building = [temp[0].x, temp[0].y];
    //self.log(karbPaths);
    //self.log(fuelPaths);
  }
  
  if(self.step < 2){
    var nexStep = movement.get_next_step_astar_turn([self.me.x,self.me.y],resource.find_possible_castle_locations([self.me.x-1,self.me.y-1],self.map,self.fuel_map),self.map,
    currentPath.concat(movement.get_visible_robots_list(self.getVisibleRobots())),3);
      var movex = nexStep[0] - self.me.x;
      var movey = nexStep[1] - self.me.y;
      //self.log("stepCounter : " + stepCounter);
      //self.log("location : " + self.me.x + "," +self.me.y);
      return self.move(movex,movey);
  }else{
    if(self.time <10){
      return;
    }
  
    if(done === false){
      
      //self.log(building[0]);
      var nextStep = movement.get_next_checkerboard_step([self.me.x,self.me.y],self.map,self.getVisibleRobots(),currentPath.concat(karbPaths.concat(fuelPaths)),self);
      if(nextStep[0] == self.me.x && nextStep[1] == self.me.y || movement.get_distance(nextStep, building) <= Math.sqrt(8)){
        //need to go somehere
        nextStep = movement.get_possible_square_steps_list([self.me.x,self.me.y],self.map);
        var nearRobots = movement.get_visible_robots_list(self.getVisibleRobots());
        var i;
        var current = movement.get_random_from_list(nextStep);
        while(movement.check_if_coor_in_path([current[0] + self.me.x, current[1] + self.me.y], nearRobots.concat(currentPath)) == true){
          current = movement.get_random_from_list(nextStep);
          
        }
        //self.log("no pass");
        //self.log(current);
        currentPath.push([self.me.x, self.me.y]);
        return self.move(current[0],current[1]);
      }else{
        var movex = nextStep[0] - self.me.x;
        var movey = nextStep[1] - self.me.y;
        done = true;
        //self.log("done");
        //self.log(nextStep);
        return self.move(movex,movey);
      }
      
    }else{
      //attack
      
      //self.log(visible);
      var enemies = combat.get_visible_enemies(self.me.team, visible);
      var curr_loc = {'x': self.me.x, 'y':self.me.y};
      if (enemies.length !== 0){
        //self.log("We see an enemy!");
          var target = resource.find_nearest_node(curr_loc, enemies);
          //self.lof(target);
          //Check if in range
          var dist = movement.get_distance([curr_loc.x,curr_loc.y], [target.x,target.y]);
          if (dist <= 4){
              //self.log("Attacking enemy!");
              var attack = combat.get_relative_position(curr_loc, target);
              return self.attack(attack.x, attack.y);      
          }                    
      }
    }
  }
};


export default crusader;