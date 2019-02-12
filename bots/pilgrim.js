import {BCAbstractRobot, SPECS} from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';

import * as movement from './movement.js';

const pilgrim = {};
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths;
var typePil;

pilgrim.takeTurn = (self) => {
  
  var curr_loc = {'x': self.me.x, 'y':self.me.y};
          var visible = self.getVisibleRobots();
          if(typeof typePil === 'undefined'){
            self.log("here");
            if (visible.filter(robot => robot.team === self.me.team && robot.unit === SPECS.PILGRIM).length > 1){
              typePil = 1;
            }else{
              typePil = 0;
            }
            self.log(typePil);
            
          }
          if(typePil == 1){
            self.signal(666, 25);
            var nearest_karb = resource.find_nearest_node(curr_loc, resource.get_resource_nodes(self.getFuelMap()));
          
            if (self.me.fuel !== 100){
              if (curr_loc.x ===  nearest_karb.x && curr_loc.y === nearest_karb.y) {
                     //self.log("I am mining fuel!");
                      //self.log("I am carrying " + self.me.fuel + " fuel, and " + self.me.karbonite);
                      return self.mine();
              }
              var nexStep = movement.get_next_step([self.me.x,self.me.y],[nearest_karb.x,nearest_karb.y],self.map,movement.get_visible_robots_list(visible),2);
              var movex = nexStep[0] - self.me.x;
              var movey = nexStep[1] - self.me.y;
              //self.log("location : " + self.me.x + "," +self.me.y);
              //self.log("movement : " + movex + ";" + movey);
              return self.move(movex,movey);
            }else{
              //self.log("I am full! Looking for nearest castle...");
              var nearest_castle = resource.find_nearest_unit(curr_loc, visible, 0);
              //self.log("Nearest castle is at (" + nearest_castle.x + ", " + nearest_castle.y +")");
              var dist = movement.get_distance([self.me.x,self.me.y],[nearest_castle.x,nearest_castle.y]);
              if(dist <= Math.sqrt(2)){
                //self.log("I am unloading resources");
                var dx = nearest_castle.x - curr_loc.x;
                var dy = nearest_castle.y - curr_loc.y;
                return self.give(dx, dy, self.me.karbonite, self.me.fuel);
              }
              var nexStep = movement.get_next_step_astar_turn([self.me.x,self.me.y],[nearest_castle.x,nearest_castle.y],self.map,movement.get_visible_robots_list(visible),2);
              var movex = nexStep[0] - self.me.x;
              var movey = nexStep[1] - self.me.y;
              //self.log("location : " + self.me.x + "," +self.me.y);
              //self.log("movement : " + movex + ";" + movey);
              return self.move(movex,movey);
            }
            
          }else if(typePil == 0){
            self.signal(6969, 25);
            var nearest_karb = resource.find_nearest_node(curr_loc, resource.get_resource_nodes(self.getKarboniteMap()));
          
            if (self.me.karbonite !== 20){
              if (curr_loc.x ===  nearest_karb.x && curr_loc.y === nearest_karb.y) {
                    //  self.log("I am mining karb!");
                      //self.log("I am carrying " + self.me.fuel + " fuel, and " + self.me.karbonite);
                      return self.mine();
              }
              var nexStep = movement.get_next_step_astar_turn([self.me.x,self.me.y],[nearest_karb.x,nearest_karb.y],self.map,movement.get_visible_robots_list(visible),2);
              var movex = nexStep[0] - self.me.x;
              var movey = nexStep[1] - self.me.y;
              //self.log("location : " + self.me.x + "," +self.me.y);
              //self.log("movement : " + movex + ";" + movey);
              return self.move(movex,movey);
            }else{
              //self.log("I am full! Looking for nearest castle...");
              var nearest_castle = resource.find_nearest_unit(curr_loc, visible, 0);
              //self.log("Nearest castle is at (" + nearest_castle.x + ", " + nearest_castle.y +")");
              var dist = movement.get_distance([self.me.x,self.me.y],[nearest_castle.x,nearest_castle.y]);
              if(dist <= Math.sqrt(2)){
                //self.log("I am unloading resources");
                var dx = nearest_castle.x - curr_loc.x;
                var dy = nearest_castle.y - curr_loc.y;
                return self.give(dx, dy, self.me.karbonite, self.me.fuel);
              }
              var nexStep = movement.get_next_step([self.me.x,self.me.y],[nearest_castle.x,nearest_castle.y],self.map,movement.get_visible_robots_list(visible),2);
              var movex = nexStep[0] - self.me.x;
              var movey = nexStep[1] - self.me.y;
              //self.log("location : " + self.me.x + "," +self.me.y);
              //self.log("movement : " + movex + ";" + movey);
              return self.move(movex,movey);
            }
          }
};


export default pilgrim;