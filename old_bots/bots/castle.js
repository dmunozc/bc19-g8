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
castle.takeTurn = (self) => {
  var possibleSteps = movement.get_open_places_castle([self.me.x, self.me.y],self.map,self.getVisibleRobots());
  //self.log("lala");
  //self.log(possibleSteps);
  var buildPlace = movement.get_random_from_list(possibleSteps);
  
  var messagingRobots = self.getVisibleRobots().filter(robot => {
      if (robot.signal == 666 || robot.signal == 6969){
        return robot;
        
      }
      return;
  });
  //self.log("msg");
  //self.log(messagingRobots);

  //self.log(buildPlace);
  if(self.step <=2){
   self.log("Building a pilgrim at " + (self.me.x+1) + ", " + (self.me.y+1));
   
        return self.buildUnit(SPECS.PILGRIM, buildPlace[0], buildPlace[1]);
  }
  
  if (self.step%6   === 1) {
      //self.log("Building a crusader at " + (self.me.x+1) + ", " + (self.me.y+1));
      return self.buildUnit(/*Math.floor(Math.random() * (4 - 4 + 1) ) + 4*/ SPECS.PROPHET, buildPlace[0], buildPlace[1]);
  }  else {
      var visible = self.getVisibleRobots();
      var enemies = combat.get_visible_enemies(self.me.team, visible);
      var curr_loc = {'x': self.me.x, 'y':self.me.y};
      if (enemies.length !== 0){
        //self.log("We see an enemy!");
          var target = resource.find_nearest_node(curr_loc, enemies);
          //Check if in range
          var dist = movement.get_distance([curr_loc.x,curr_loc.y], [target.x,target.y]);
          if (dist <= 8){
              //self.log("Attacking enemy!");
              var attack = combat.get_relative_position(curr_loc, target);
              return self.attack(attack.x, attack.y);      
          }                    
      }
  }
  
};


export default castle;