import { BCAbstractRobot, SPECS } from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';
import * as build from './build.js';
import * as movement from './movement.js';
import * as message from './message.js';

const pilgrim = {};
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths;
var typePil;
var resource_list;
var castleLoc = { 'x': -1, 'y': -1 };
var destination = {"x": -1, "y": -1};
var step = 0;

pilgrim.takeTurn = (self) => {


  var curr_loc = { 'x': self.me.x, 'y': self.me.y };
  var visible = self.getVisibleRobots();
  var karbonite = resource.get_resource_nodes(self.getKarboniteMap());
  var fuel = resource.get_resource_nodes(self.getFuelMap());
  var resources = karbonite.concat(fuel);
  resources = resource.update_nodes(curr_loc, resources, visible);

  //Using this to count pilgrims
  self.castleTalk(2);

  if (castleLoc.x == -1) {
    if (resource.get_number_of_units(visible, 1) === 0) {
      castleLoc = resource.find_nearest_unit(curr_loc, visible, 0);
    } else {
      castleLoc = resource.find_nearest_unit(curr_loc, visible, 1);
    }
  }

  if (step === 0) {
    self.log("pilgrim initializing....");
    var karbonite = resource.get_resource_nodes(self.getKarboniteMap());
    var fuel = resource.get_resource_nodes(self.getFuelMap());
    resource_list = karbonite.concat(fuel);    
    var nearest_karb = resource.find_nearest_unoccupied_node(curr_loc, resources);
    if (movement.get_distance([curr_loc.x, curr_loc.y], [nearest_karb.x, nearest_karb.y]) <= 5){
      destination = nearest_karb;
      self.log("Mining at:");
      self.log(destination);
    }
  }
  // this.log("(" + nearest_karb.x + "," + nearest_karb.y+ ")");
  if (destination.x === -1){
    self.castleTalk(10);
    destination = message.parse_message(self, visible);
    self.log("Received message");
    self.log(destination);
  }


  step++;

  if (self.me.karbonite !== 20 && self.me.fuel !== 100 && destination.x != -1) {
    if (curr_loc.x === destination.x && curr_loc.y === destination.y) {
      //self.log("I am mining!");
      //this.log("I am carrying " + this.me.fuel + " fuel, and " + this.me.karbonite);
      return self.mine();
    }
    var nexStep = movement.get_next_step_astar_turn([self.me.x, self.me.y], [destination.x, destination.y], self.map, movement.get_visible_robots_list(visible), 2);
    var movex = nexStep[0] - self.me.x;
    var movey = nexStep[1] - self.me.y;
    //this.log("location : " + this.me.x + "," +this.me.y);
    //this.log("movement : " + movex + ";" + movey);
    return self.move(movex, movey);
  } else {
    //self.log("is castle locs empty? " + castleLocs.length);
    //this.log("I am full! Looking for nearest castle...");
    // var nearest_castle = resource.find_nearest_unit(curr_loc, visible, 0);
    //this.log("Nearest castle is at (" + nearest_castle.x + ", " + nearest_castle.y +")");
    var dist = movement.get_distance([self.me.x, self.me.y], [castleLoc.x, castleLoc.y]);
    // If the castle is far away, we should build a church
    if (dist >= 5) {
      var visible = self.getVisibleRobots();
      var num_churches = resource.get_number_of_units(visible, 1);
      if (num_churches === 0) {
        self.castleTalk(11);
        self.log("I am going to build a church");
        var build_loc = build.find_location_to_build_unit(curr_loc, self.getPassableMap(), visible, resource_list, self);
        var buildPlace = [build_loc.x, build_loc.y];
        return self.buildUnit(SPECS.CHURCH, buildPlace[0], buildPlace[1]);
      }
      else if (num_churches >= 1) {
        castleLoc = resource.find_nearest_unit(curr_loc, visible, 1);
        dist = movement.get_distance([self.me.x, self.me.y], [castleLoc.x, castleLoc.y]);
      }
    }
    if (dist <= Math.sqrt(2)) {
      // self.log("I am unloading resources");
      var dx = castleLoc.x - curr_loc.x;
      var dy = castleLoc.y - curr_loc.y;
      return self.give(dx, dy, self.me.karbonite, self.me.fuel);
    }
    var nexStep = movement.get_next_step([self.me.x, self.me.y], [castleLoc.x, castleLoc.y], self.map, movement.get_visible_robots_list(visible), 2);
    var movex = nexStep[0] - self.me.x;
    var movey = nexStep[1] - self.me.y;
    //self.log("location : " + self.me.x + "," +self.me.y);
    //self.log("movement : " + movex + ";" + movey);
    return self.move(movex, movey);
  }

};


export default pilgrim;