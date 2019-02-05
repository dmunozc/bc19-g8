import { BCAbstractRobot, SPECS } from 'battlecode';
import * as resource from './resource.js';
import * as combat from './combat.js';
import pilgrim from './pilgrim.js';
import * as movement from './movement.js';
import castle from './castle.js';
import prophet from './prophet.js';
import crusader from './crusader.js';

var step = -1;
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths
var pilgrimCount = 0;
var castleLocs = [];


class MyRobot extends BCAbstractRobot {
  constructor() {
      super();
      this.step = -1;
  }
  turn() {
    this.step++;

    if (this.me.unit === SPECS.CRUSADER) {
      return crusader.takeTurn(this);
    }

    else if (this.me.unit === SPECS.CASTLE) {
      return castle.takeTurn(this);
    } else if (this.me.unit === SPECS.PILGRIM) {
      return pilgrim.takeTurn(this);

    }

  }
}

var robot = new MyRobot();
