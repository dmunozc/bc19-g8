import {BCAbstractRobot, SPECS} from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';

import * as movement from './movement.js';

const pilgrim = {};
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths
var pilgrimCount = 0;
var castleLocs = [];

pilgrim.takeTurn = (self) => {
  
  var curr_loc = { 'x': self.me.x, 'y': self.me.y };
  var visible = self.getVisibleRobots();
  var karbonite = resource.get_resource_nodes(self.getKarboniteMap());
  var fuel = resource.get_resource_nodes(self.getFuelMap());
  var resources = karbonite.concat(fuel);
  karbonite = resource.update_nodes(curr_loc, resources, visible);


  var nearest_karb = resource.find_nearest_unoccupied_node(curr_loc, resources);
  // this.log("(" + nearest_karb.x + "," + nearest_karb.y+ ")");

  if (self.me.karbonite !== 20 && self.me.fuel !== 100) {
    if (curr_loc.x === nearest_karb.x && curr_loc.y === nearest_karb.y) {
      self.log("I am mining!");
      //this.log("I am carrying " + this.me.fuel + " fuel, and " + this.me.karbonite);
      return self.mine();
    }
    var nexStep = movement.get_next_step([self.me.x, self.me.y], [nearest_karb.x, nearest_karb.y], self.map, movement.get_visible_robots_list(visible), 2);
    var movex = nexStep[0] - self.me.x;
    var movey = nexStep[1] - self.me.y;
    //this.log("location : " + this.me.x + "," +this.me.y);
    //this.log("movement : " + movex + ";" + movey);
    return self.move(movex, movey);
  } else {
    self.log("is castle locs empty? " + castleLocs.length);
    //this.log("I am full! Looking for nearest castle...");
    var nearest_castle = resource.find_nearest_unit(curr_loc, visible, 0);
    //this.log("Nearest castle is at (" + nearest_castle.x + ", " + nearest_castle.y +")");
    var dist = movement.get_distance([self.me.x, self.me.y], [nearest_castle.x, nearest_castle.y]);
    if (dist <= Math.sqrt(2)) {
      //self.log("I am unloading resources");
      var dx = nearest_castle.x - curr_loc.x;
      var dy = nearest_castle.y - curr_loc.y;
      return self.give(dx, dy, self.me.karbonite, self.me.fuel);
    }
    var nexStep = movement.get_next_step([self.me.x, self.me.y], [nearest_castle.x, nearest_castle.y], self.map, movement.get_visible_robots_list(visible), 2);
    var movex = nexStep[0] - self.me.x;
    var movey = nexStep[1] - self.me.y;
    //self.log("location : " + self.me.x + "," +self.me.y);
    //self.log("movement : " + movex + ";" + movey);
    return self.move(movex, movey);
  }
};


export default pilgrim;