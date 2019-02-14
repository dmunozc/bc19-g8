import {BCAbstractRobot, SPECS} from 'battlecode';
import * as resource from './resource.js';
import * as combat from './combat.js';
import pilgrim from './pilgrim.js';
import * as movement from './movement.js';
import castle from './castle.js';
import church from './church.js';
import prophet from './prophet.js';
import crusader from './crusader.js';
import preacher from './preacher.js';

class MyRobot extends BCAbstractRobot {
  
  constructor() {
      super();
      this.step = -1;
  }
    turn() {
    //step++;
    this.step++;


    if (this.me.unit === SPECS.PROPHET) {
      return prophet.takeTurn(this);
    } else if (this.me.unit === SPECS.PILGRIM) {
      return pilgrim.takeTurn(this);
    } else if (this.me.unit === SPECS.CRUSADER) {
      return crusader.takeTurn(this);
    } else if (this.me.unit === SPECS.PREACHER) {
      return preacher.takeTurn(this);
    } else if (this.me.unit === SPECS.CHURCH) {
      return church.takeTurn(this);
    } else if (this.me.unit === SPECS.CASTLE) {
      //this.myType = castle;
      return castle.takeTurn(this);
    }


  }
}

var robot = new MyRobot();