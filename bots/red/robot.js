import {BCAbstractRobot, SPECS} from 'battlecode';
import * as resource from './resource.js';
import * as combat from './combat.js';
//import pilgrim from './pilgrim.js';
import * as movement from './movement.js';

var step = -1;
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations

class MyRobot extends BCAbstractRobot {
    turn() {
        step++;
        
       
        if (this.me.unit === SPECS.CRUSADER) {
          if(step === 0){
            //i know on creation I will be x+1,y+1 away from castle as per code below
            var castlePaths =  resource.find_possible_castle_locations([this.me.x-1,this.me.y-1],this.map,this.fuel_map);
            this.log(["me at: " + this.me.x,this.me.y]);
            this.log("castle paths: ");
           this.log(castlePaths);
            path = movement.find_path_to_coordinate([this.me.x,this.me.y],castlePaths,this.map,this.me);
            this.log("chosen path: " );
            this.log(path);
            stepCounter = 0;
            //this.log(path);
          }
            // this.log("Crusader health: " + this.me.health);
            //const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            //const choice = choices[Math.floor(Math.random()*choices.length)]
            var visible = this.getVisibleRobots();
            var enemies = combat.get_visible_enemies(this.me.team, visible);
            var curr_loc = {'x': this.me.x, 'y':this.me.y};
            if (enemies.length !== 0){
              this.log("We see an enemy!");
                var target = resource.find_nearest_node(curr_loc, enemies);
                //Check if in range
                var dist = resource.calculate_distance(curr_loc, target);
                if (dist <= 4){
                    this.log("Attacking enemy!");
                    var attack = combat.get_relative_position(curr_loc, target);
                    return this.attack(attack.x, attack.y);      
                }                    
            }
            if(stepCounter < path.length){
              var movex = path[stepCounter][0] - this.me.x;
              var movey =  path[stepCounter][1] - this.me.y;
              
              this.log("stepCounter : " + stepCounter);
              this.log("location : " + [this.me.x,this.me.y]);
              this.log("movement : " + movex + ";" + movey);
              stepCounter++;
              return this.move(movex,movey);
            }else{
              return
            }
            return;
            //return this.move(path[stepCounter][1],);
        }

        else if (this.me.unit === SPECS.CASTLE) {
          if(step== 0){
           // find_possible_castle_locations([this.me.x,this.me.y],this.map);
             //this.log(this.map);
          }
            if (step %20 === 0) {
                this.log("Building a crusader at " + (this.me.x+1) + ", " + (this.me.y+1));
                return this.buildUnit(SPECS.CRUSADER, 1, 1);
            } else {
                return // this.log("Castle health: " + this.me.health);
            }
        }

    }
}

var robot = new MyRobot();
