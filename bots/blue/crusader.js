import {BCAbstractRobot, SPECS} from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';

import * as movement from './movement.js';

const crusader = {};
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths
var pilgrimCount = 0;
var castleLocs = [];

crusader.takeTurn = (self) => {
  if (self.step === 0) {
    //i know on creation I will be x+1,y+1 away from castle as per code below
    ////this.log(this.fuel_map);
    castlePaths = resource.find_possible_castle_locations([self.me.x - 1, self.me.y - 1], self.map, self.fuel_map);
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
  var visible = self.getVisibleRobots();
  var enemies = combat.get_visible_enemies(self.me.team, visible);
  var curr_loc = { 'x': self.me.x, 'y': self.me.y };
  if (enemies.length !== 0) {
    //this.log("We see an enemy!");
    var target = resource.find_nearest_node(curr_loc, enemies);
    //Check if in range
    var dist = movement.get_distance([curr_loc.x, curr_loc.y], [target.x, target.y]);
    if (dist <= 4) {
      //this.log("Attacking enemy!");
      var attack = combat.get_relative_position(curr_loc, target);
      return self.attack(attack.x, attack.y);
    }
  }

  currentPath[stepCounter] = [self.me.x, self.me.y];
  if (stepCounter == 0) {
    stepCounter++;
    if (Math.abs(castlePaths[0] - self.me.x) == 1) {
      return self.move(-1, 0);
    }
    if (Math.abs(castlePaths[1] - self.me.y) == 1) {
      return self.move(0, -1);
    }

  }
  ////this.log("me : " + this.me.x + "," +this.me.y);
  ////this.log("cP " + castlePaths);
  var nexStep = movement.get_next_step([self.me.x, self.me.y], castlePaths, self.map, currentPath.concat(movement.get_visible_robots_list(visible)), 3);
  var movex = nexStep[0] - self.me.x;
  var movey = nexStep[1] - self.me.y;
  //this.log("stepCounter : " + stepCounter);
  //this.log("location : " + this.me.x + "," +this.me.y);
  //this.log("movement : " + movex + ";" + movey);
  stepCounter++;
  return self.move(movex, movey);

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

};


export default crusader;