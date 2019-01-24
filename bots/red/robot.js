import {BCAbstractRobot, SPECS} from 'battlecode';
import * as resource from './resource.js';
//import * as combat from './combat.js';
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
            var castlePaths =  resource.find_possible_castle_locations([this.me.x-1,this.me.y-1],this.map,this);
            //this.log([this.me.x,this.me.y]);
            this.log(castlePaths);
           
            path = movement.find_path_to_coordinate([this.me.x,this.me.y],castlePaths[1],this.map,this);
            this.log(path);
            stepCounter = 0;
            //this.log(path);
          }
            // this.log("Crusader health: " + this.me.health);
            //const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            //const choice = choices[Math.floor(Math.random()*choices.length)]
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
            //return this.move(path[stepCounter][1],);
        }

        else if (this.me.unit === SPECS.CASTLE) {
          if(step % 20 == 0){
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
