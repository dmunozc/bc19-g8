import {BCAbstractRobot, SPECS} from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';

import * as movement from './movement.js';

const castle = {};
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths
var pilgrimCount = 0;
var castleLocs = [];

castle.takeTurn = (self) => {
  
  
  
  if (self.step % 5 === 0 && pilgrimCount < 3) {
    //  this.log("Building a pilgrim at " + (this.me.x+1) + ", " + (this.me.y+1));
    pilgrimCount++;
    self.log("Pilgrim count is " + pilgrimCount);
    return self.buildUnit(SPECS.PILGRIM, 1, 1);
  }
  if (step % 5 === 1) {
    //this.log("Building a crusader at " + (this.me.x+1) + ", " + (this.me.y+1));
    return self.buildUnit(SPECS.CRUSADER, 1, 1);
  } else {
    castleLocs.push({ x: self.me.x, y: self.me.y });
    return // //this.log("Castle health: " + this.me.health);
  }
  
      
  var possibleSteps = movement.get_possible_square_steps_list([self.me.x, self.me.y],self.map);
  //self.log("lala");
  //self.log(possibleSteps);
  var buildPlace = movement.get_random_from_list(possibleSteps);
  var messagingRobots = self.getVisibleRobots().filter(robot => {
      if (robot.signal == 666 || robot.signal == 6969){
        return robot;
        
      }
      return;
  });
  
};


export default castle;