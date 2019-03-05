import { BCAbstractRobot, SPECS } from 'battlecode';
import * as combat from './combat.js';
import * as resource from './resource.js';

import * as movement from './movement.js';

const preacher = {};
var stepCounter = 0;
var path;
var possibleOpponentCastleLocations = [];//y,x locations
var currentPath = [];
var castlePaths


preacher.takeTurn = (self) => {
    if (self.step === 0) {
        castlePaths = resource.find_possible_castle_locations([self.me.x - 1, self.me.y - 1], self.map, self.fuel_map);
        stepCounter = 0;
    }

    var visible = self.getVisibleRobots();
    var enemies = combat.get_visible_enemies(self.me.team, visible);
    var curr_loc = { 'x': self.me.x, 'y': self.me.y };
    if (enemies.length !== 0) {
        var target = resource.find_nearest_node(curr_loc, enemies);
        //Check if in range
        var dist = movement.get_distance([curr_loc.x, curr_loc.y], [target.x, target.y]);
        if (dist <= 4) {
            var attack = combat.get_relative_position(curr_loc, target);
            return self.attack(attack.x, attack.y);
        }
    }
    if (self.step < 6 || visible.length > 2) {


        currentPath[stepCounter] = [self.me.x, self.me.y];
        if (stepCounter == 0) {
            stepCounter++;
            if (Math.abs(castlePaths[0] - self.me.x) == 1) {
                return self.move(-1, 0);
            }
            if (Math.abs(castlePaths[1] - self.me.y) == 1) {
                return self.move(0, -1);
            }

        }

        var nexStep = movement.get_next_step_astar_turn([self.me.x, self.me.y], castlePaths, self.map, currentPath.concat(movement.get_visible_robots_list(visible)), 2);
        var movex = nexStep[0] - self.me.x;
        var movey = nexStep[1] - self.me.y;

        stepCounter++;
        return self.move(movex, movey);
    }

    return;

};


export default preacher;