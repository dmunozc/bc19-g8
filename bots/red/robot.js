import {BCAbstractRobot, SPECS} from 'battlecode';
import * as resource from './resource.js';
import * as combat from './combat.js';
import pilgrim from './pilgrim.js';
import * as movement from './movement.js';

var step = -1;

var possibleOpponentCastleLocations = [];//y,x locations

class MyRobot extends BCAbstractRobot {
    turn() {
        step++;
        
       
        if (this.me.unit === SPECS.CRUSADER) {
            // this.log("Crusader health: " + this.me.health);
            const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
        }

        else if (this.me.unit === SPECS.CASTLE) {
          if(step === 0){
             possibleOpponentCastleLocations[0] = [this.me.y, (this.map.length - 1 - this.me.x)]
             possibleOpponentCastleLocations[1] = [(this.map.length - 1 - this.me.y),this.me.x]
             var closesIndex = findClosestCastle(this.me.x, this.me.y, possibleOpponentCastleLocations, this.map,this);
             this.log(this.me.y + "," + this.me.x)
             this.log(possibleOpponentCastleLocations)
             this.log("closest castle is: " + possibleOpponentCastleLocations[closesIndex]);
          }
            if (step % 10 === 0) {
                this.log("Building a crusader at " + (this.me.x+1) + ", " + (this.me.y+1));
                return this.buildUnit(SPECS.CRUSADER, 1, 1);
            } else {
                return // this.log("Castle health: " + this.me.health);
            }
        }

    }
}

var robot = new MyRobot();
