import {BCAbstractRobot, SPECS} from 'battlecode';
import pilgrim from './pilgrim.js';
import crusader from './crusader.js';
import castle from './castle.js';

var step = -1;

class MyRobot extends BCAbstractRobot {
	constructor() {
        super();
        this.step = -1;
        this.numOfPilgrimsBuilt = 0;
    }
    turn() {
        step++;
		
		if (this.me.unit === SPECS.CRUSADER) {
			const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
			const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
        }
		
		if (this.me.unit === SPECS.PILGRIM) {
			const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
			const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
        }

        else if (this.me.unit === SPECS.CASTLE) {
            if (step % 30 === 0) {
                this.log("Building a crusader at " + (this.me.x+1) + ", " + (this.me.y+1));
                return this.buildUnit(SPECS.CRUSADER, 1, 1);
            } 
			if(this.numOfPilgrimsBuilt < 4) {
				if(this.map[this.me.y][this.me.x + 1] === true) {
					this.log("Building a pilgrim at " + (this.me.x+1) + ", " + (this.me.y));
					this.numOfPilgrimsBuilt++;
					return this.buildUnit(SPECS.PILGRIM, 1, 0);
				}
				else if(this.map[this.me.y + 1][this.me.x + 1] === true) {
			     	this.log("Building a pilgrim at " + (this.me.x+1) + ", " + (this.me.y + 1));
					this.numOfPilgrimsBuilt++;
					return this.buildUnit(SPECS.PILGRIM, 1, 1);
				}
				else if(this.map[this.me.y + 1][this.me.x] === true) {
					this.log("Building a pilgrim at " + (this.me.x) + ", " + (this.me.y + 1));
					this.numOfPilgrimsBuilt++;
					return this.buildUnit(SPECS.PILGRIM, 0, 1);
				}
				else if(this.map[this.me.y + 1][this.me.x - 1] === true) {
					this.log("Building a pilgrim at " + (this.me.x-1) + ", " + (this.me.y + 1));
					this.numOfPilgrimsBuilt++;
					return this.buildUnit(SPECS.PILGRIM, -1, 1);
				}
				else if(this.map[this.me.y][this.me.x - 1] === true) {
					this.log("Building a pilgrim at " + (this.me.x-1) + ", " + (this.me.y));
					this.numOfPilgrimsBuilt++;
					return this.buildUnit(SPECS.PILGRIM, -1, 0);
				}
				else if(this.map[this.me.y - 1][this.me.x - 1] === true) {
					this.log("Building a pilgrim at " + (this.me.x-1) + ", " + (this.me.y-1));
					this.numOfPilgrimsBuilt++;
					return this.buildUnit(SPECS.PILGRIM, -1, -1);
				}
				else if(this.map[this.me.y - 1][this.me.x] === true) {
					this.log("Building a pilgrim at " + (this.me.x) + ", " + (this.me.y - 1));
					this.numOfPilgrimsBuilt++;
					return this.buildUnit(SPECS.PILGRIM, 0, -1);
				}
				else if(this.map[this.me.y - 1][this.me.x + 1] === true) {
					this.log("Building a pilgrim at " + (this.me.x+1) + ", " + (this.me.y - 1));
					this.numOfPilgrimsBuilt++;
					return this.buildUnit(SPECS.PILGRIM, 1, -1);
				}
			}
		}
	}
}

var robot = new MyRobot();
