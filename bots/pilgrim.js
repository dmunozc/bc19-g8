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
var occupiedNodes = [];
var hasBase = false;
var castlePaths;
var typePil;
var resource_list;
var castleLoc = { 'x': -1, 'y': -1 };
var destination = {"x": -1, "y": -1};
var step = -1;

pilgrim.takeTurn = (self) => {


  var curr_loc = { 'x': self.me.x, 'y': self.me.y };
  var visible = self.getVisibleRobots();
  // var karbonite = resource.get_resource_nodes(self.getKarboniteMap());
  // var fuel = resource.get_resource_nodes(self.getFuelMap());
  // var resources = karbonite.concat(fuel);
  // resources = resource.update_nodes(curr_loc, resources, visible);

  //Using this to count pilgrims
  self.castleTalk(2);
  step++;

  if (step === 0) {
    self.log("pilgrim initializing....");
    // This assigns castle loc to nearest castle or church
    if (resource.get_number_of_units(visible, 1) === 0) {
      castleLoc = resource.find_nearest_unit(curr_loc, visible, 0);
    } else {
      castleLoc = resource.find_nearest_unit(curr_loc, visible, 1);
    }
    // This will find the neareast resource
    var karbonite = resource.get_resource_nodes(self.getKarboniteMap());
    var fuel = resource.get_resource_nodes(self.getFuelMap());
    resource_list = karbonite.concat(fuel);
    var updated_nodes = resource.update_nodes(curr_loc, resource_list, visible);    
    var nearest_karb = resource.find_nearest_unoccupied_node(curr_loc, updated_nodes);
    self.log("Nearest karb");
    self.log(nearest_karb);
    if (movement.get_distance([curr_loc.x, curr_loc.y], [nearest_karb.x, nearest_karb.y]) <= 8){
      // Their desitnation will be this node now
      destination = nearest_karb;
      hasBase = true;
      self.log("Mining at:");
      self.log(destination);
    }
  }

  //This is a quick fix to the signalling, sometimes 

  // Need to check when we get close to resource if it's occupied
  if (movement.get_distance([curr_loc.x, curr_loc.y], [destination.x, destination.y]) <= 2 && !hasBase){
    var updated_nodes = resource.update_nodes(curr_loc, resource_list, visible);
    var nearest_karb = resource.find_nearest_unoccupied_node(curr_loc, updated_nodes);
    // If they are not the same, then we need to signal for help
    if (nearest_karb.x != destination.x && nearest_karb.y != destination.y){
      destination = {"x": -1, "y": -1};
    }
  }


  // this.log("(" + nearest_karb.x + "," + nearest_karb.y+ ")");
  if (destination.x === -1){
    self.castleTalk(10);
    destination = message.parse_message(self, visible);
    self.log("Received message");
    self.log(destination);
    if (destination.x === -1){
      return;
    }
    self.castleTalk(2);
  }





  if (self.me.karbonite !== 20 && self.me.fuel !== 100 && destination.x != -1) {
    if (curr_loc.x === destination.x && curr_loc.y === destination.y) {
      hasBase = true;
      //self.log("I am mining!");
      //this.log("I am carrying " + this.me.fuel + " fuel, and " + this.me.karbonite);
      return self.mine();
    }
    var nexStep = movement.get_next_step_astar_turn([self.me.x, self.me.y], [destination.x, destination.y], self.map, currentPath.push(movement.get_visible_robots_list(visible)), 2);
    var movex = nexStep[0] - self.me.x;
    var movey = nexStep[1] - self.me.y;
    //this.log("location : " + this.me.x + "," +this.me.y);
    //this.log("movement : " + movex + ";" + movey);
    if (!hasBase){
      currentPath.push([self.me.x, self.me.y]);
    }
    return self.move(movex, movey);
  } else {
    var dist = movement.get_distance([self.me.x, self.me.y], [castleLoc.x, castleLoc.y]);
    // If the castle is far away, we should build a church
    // Or set ourselves to nearest church or castle if they exist
    if (dist >= 5) {
      var num_castles = resource.get_number_of_units(visible, 0);
      if (num_castles >= 1){
        castleLoc = resource.find_nearest_unit(curr_loc, visible, 0);
      }
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
      }
      dist = movement.get_distance([self.me.x, self.me.y], [castleLoc.x, castleLoc.y]);

    }
    if (dist <= Math.sqrt(2)) {
      // self.log("I am unloading resources");
      currentPath = [];
      var dx = castleLoc.x - curr_loc.x;
      var dy = castleLoc.y - curr_loc.y;
      return self.give(dx, dy, self.me.karbonite, self.me.fuel);
    }
    var nexStep = movement.get_next_step_astar_turn([self.me.x, self.me.y], [castleLoc.x, castleLoc.y], self.map, currentPath.push(movement.get_visible_robots_list(visible)), 2);
    var movex = nexStep[0] - self.me.x;
    var movey = nexStep[1] - self.me.y;
    //self.log("location : " + self.me.x + "," +self.me.y);
    //self.log("movement : " + movex + ";" + movey);
    return self.move(movex, movey);
  }

};


export default pilgrim;