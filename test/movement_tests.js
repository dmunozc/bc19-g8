// load Unit.js module
var test = require('unit.js');
var movement = require('../bots/red/movement_test.js');
var temp;

mapTest = [[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true],[true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true],[true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,false,false,false,false,false,true,true,true,true,true],[true,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,true,true,true],[true,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,true,true,true,true,true,true,true],[true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,false,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,false,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true],[true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,false,false,false,true,true,true,true,true],[true,true,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,false,false,false,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true],[true,true,true,true,true,false,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true],[true,true,false,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,true,true,true,true,true,true,true],[true,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,true,true,true],[true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,false,false,false,false,false,true,true,true,true,true],[true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]];


var openMap = [[true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true]];
              
var map1 =   [[true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,false,false,false,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true],
              [true,true,true,true,true,true,true,true]];              
      

      
var result1 = movement.get_direction([0,0],[2,2]);
test.assert(result1[0] === 1);
test.assert(result1[1] === 1);

result1 = movement.get_direction([0,0],[0,0]);
test.assert(result1[0] === 0);
test.assert(result1[1] === 0);

result1 = movement.get_direction([2,2],[0,0]);
test.assert(result1[0] === -1);
test.assert(result1[1] === -1);

result1 = movement.get_direction([0,0],[0,2]);
test.assert(result1[0] === 0);
test.assert(result1[1] === 1);

result1 = movement.get_direction([0,0],[2,0]);
test.assert(result1[0] === 1);
test.assert(result1[1] === 0);


/**Test check_if_coor_in_path(coor,paths)*/
var result2;
//list of coors
var coors1 = [[0,0],[1,1],[2,2],[3,3]];
result2 = movement.check_if_coor_in_path([0,0],coors1);
test.assert(result2 === true);
result2 = movement.check_if_coor_in_path([2,2],coors1);
test.assert(result2 === true);
result2 = movement.check_if_coor_in_path([0,0],[]);
test.assert(result2 === false);
result2 = movement.check_if_coor_in_path([1,0],coors1);
test.assert(result2 === false);

/**Test get_possible_step_list(coor,map,radius)*/
var result3;
radius = 1;
//in middle of open map
result3 = movement.get_possible_step_list([3,3],openMap,radius);
test.assert(result3.length == 4);
//in corner of open map
result3 = movement.get_possible_step_list([0,0],openMap,radius);
test.assert(result3.length == 2);
//at 4 limits of open map
result3 = movement.get_possible_step_list([3,0],openMap,radius);
test.assert(result3.length == 3);
result3 = movement.get_possible_step_list([0,3],openMap,radius);
test.assert(result3.length == 3);
result3 = movement.get_possible_step_list([3,7],openMap,radius);
test.assert(result3.length == 3);
result3 = movement.get_possible_step_list([7,3],openMap,radius);
test.assert(result3.length == 3);

radius = 2;
//in middle of open map
result3 = movement.get_possible_step_list([3,3],openMap,radius);
test.assert(result3.length == 12);
//in corner of open map
result3 = movement.get_possible_step_list([0,0],openMap,radius);
test.assert(result3.length == 5);
//at 4 limits of open map
result3 = movement.get_possible_step_list([3,0],openMap,radius);
test.assert(result3.length == 8);
result3 = movement.get_possible_step_list([0,3],openMap,radius);
test.assert(result3.length == 8);
result3 = movement.get_possible_step_list([3,7],openMap,radius);
test.assert(result3.length == 8);
result3 = movement.get_possible_step_list([7,3],openMap,radius);
test.assert(result3.length == 8);

radius = 3;
//in middle of open map
result3 = movement.get_possible_step_list([3,4],map1,radius);
test.assert(result3.length == 25);

/*Test get_max_movement(direction,radius)**/
var result4;
radius = 2;
result4 = movement.get_max_movement([1,1],radius,openMap,[1,1]);
test.assert(result4[0] === 1);
test.assert(result4[1] === 1);
result4 = movement.get_max_movement([0,1],radius,openMap,[0,1]);
test.assert(result4[0] === 0);
test.assert(result4[1] === 2);
result4 = movement.get_max_movement([1,0],radius,openMap,[1,0]);
test.assert(result4[0] === 2);
test.assert(result4[1] === 0);
result4 = movement.get_max_movement([0,0],radius,openMap,[0,0]);
test.assert(result4[0] === 0);
test.assert(result4[1] === 0);
result4 = movement.get_max_movement([-1,-1],radius,openMap,[-1,-1]);
test.assert(result4[0] === -1);
test.assert(result4[1] === -1);

radius = 3;
result4 = movement.get_max_movement([1,1],radius,openMap,[1,1]);
test.assert(result4[0] === 2);
test.assert(result4[1] === 2);
result4 = movement.get_max_movement([0,1],radius,openMap,[0,1]);
test.assert(result4[0] === 0);
test.assert(result4[1] === 3);

/*Test get_next_step(currentLocation,destination,map,currentPath,radius)**/
var result5;
radius = 2;
result5 = movement.get_next_step([0,0],[7,7],openMap,[],radius);
test.assert(result5[0] === 1);
test.assert(result5[1] === 1);
result5 = movement.get_next_step([0,0],[0,7],openMap,[],radius);
test.assert(result5[0] === 0);
test.assert(result5[1] === 2);
result5 = movement.get_next_step([0,0],[7,0],openMap,[],radius);
test.assert(result5[0] === 2);
test.assert(result5[1] === 0);
result5 = movement.get_next_step([7,7],[0,0],openMap,[],radius);
test.assert(result5[0] === 7-1);
test.assert(result5[1] === 7-1);
result5 = movement.get_next_step([0,7],[0,0],openMap,[],radius);
test.assert(result5[0] === 0);
test.assert(result5[1] === 7-2);
result5 = movement.get_next_step([7,0],[0,0],openMap,[],radius);
test.assert(result5[0] === 7-2);
test.assert(result5[1] === 0);

radius = 3;
result5 = movement.get_next_step([0,0],[7,7],openMap,[],radius);
test.assert(result5[0] === 2);
test.assert(result5[1] === 2);
result5 = movement.get_next_step([0,0],[0,7],openMap,[],radius);
test.assert(result5[0] === 0);
test.assert(result5[1] === 3);
result5 = movement.get_next_step([0,0],[7,0],openMap,[],radius);
test.assert(result5[0] === 3);
test.assert(result5[1] === 0);
result5 = movement.get_next_step([7,7],[0,0],openMap,[],radius);
test.assert(result5[0] === 7-2);
test.assert(result5[1] === 7-2);
result5 = movement.get_next_step([0,7],[0,0],openMap,[],radius);
test.assert(result5[0] === 0);
test.assert(result5[1] === 7-3);
result5 = movement.get_next_step([7,0],[0,0],openMap,[],radius);
test.assert(result5[0] === 7-3);
test.assert(result5[1] === 0);
result5 = movement.get_next_step([0,0],[0,2],openMap,[],radius);
test.assert(result5[0] === 0);
test.assert(result5[1] === 2);
result5 = movement.get_next_step([0,0],[7,7],openMap,[[2,2]],radius);
temp = result5[0] == 2 && result5[1] == 2;
test.assert(temp == false);

radius = 1;
result5 = movement.get_next_step([3,4],[3,0],map1,[],radius);
temp = result5[0] == 3 && result5[1] == 3;
test.assert(temp === false);

radius = 3;
result5 = movement.get_next_step([3,4],[3,0],map1,[],radius);
temp = result5[0] == 3 && result5[1] == 3;
test.assert(temp === false);
temp = result5[0] == 2 && result5[1] == 3;
test.assert(temp === false);
temp = result5[0] == 4 && result5[1] == 3;
test.assert(temp === false);
/*Test find_path_to_coordinate(origin,destination,map,unit)**/
var result6;
result6 = movement.find_path_to_coordinate([0,0],[7,7],openMap,{'unit':2});
test.assert(result6[result6.length-1][0] === 7);
test.assert(result6[result6.length-1][1] === 7);
result6 = movement.find_path_to_coordinate([0,0],[0,7],openMap,{'unit':2});
test.assert(result6[result6.length-1][0] === 0);
test.assert(result6[result6.length-1][1] === 7);
result6 = movement.find_path_to_coordinate([0,0],[7,0],openMap,{'unit':2});
test.assert(result6[result6.length-1][0] === 7);
test.assert(result6[result6.length-1][1] === 0);
result6 = movement.find_path_to_coordinate([0,0],[3,4],openMap,{'unit':2});
test.assert(result6[result6.length-1][0] === 3);
test.assert(result6[result6.length-1][1] === 4);
result6 = movement.find_path_to_coordinate([0,0],[7,7],openMap,{'unit':3});
test.assert(result6[result6.length-1][0] === 7);
test.assert(result6[result6.length-1][1] === 7);
result6 = movement.find_path_to_coordinate([0,0],[0,7],openMap,{'unit':3});
test.assert(result6[result6.length-1][0] === 0);
test.assert(result6[result6.length-1][1] === 7);
result6 = movement.find_path_to_coordinate([0,0],[7,0],openMap,{'unit':3});
test.assert(result6[result6.length-1][0] === 7);
test.assert(result6[result6.length-1][1] === 0);
result6 = movement.find_path_to_coordinate([0,0],[3,4],openMap,{'unit':3});
test.assert(result6[result6.length-1][0] === 3);
test.assert(result6[result6.length-1][1] === 4);
result6 = movement.find_path_to_coordinate([0,0],[7,7],map1,{'unit':3});
test.assert(result6[result6.length-1][0] === 7);
test.assert(result6[result6.length-1][1] === 7);
result6 = movement.find_path_to_coordinate([0,0],[0,7],map1,{'unit':3});
test.assert(result6[result6.length-1][0] === 0);
test.assert(result6[result6.length-1][1] === 7);
result6 = movement.find_path_to_coordinate([0,0],[7,0],map1,{'unit':3});
test.assert(result6[result6.length-1][0] === 7);
test.assert(result6[result6.length-1][1] === 0);
result6 = movement.find_path_to_coordinate([0,0],[4,6],map1,{'unit':3});
test.assert(result6[result6.length-1][0] === 4);
result6 = movement.find_path_to_coordinate([2,2],[6,2],openMap,{'unit':3});
test.assert(result6[result6.length-1][0] === 6);
test.assert(result6[result6.length-1][1] === 2);

//[[13,8],[13,11],[13,14],[13,17],[13,20],[13,23],[13,26],[13,29],[13,32],[13,35],[13,38],[13,41],[13,44],[13,45]]
console.log("@@@@@@@@@@@@@@@");
result6 = movement.find_path_to_coordinate([13,5],[13,45],mapTest,{'unit':3});
test.assert(result6[result6.length-1][0] === 13);
test.assert(result6[result6.length-1][1] === 45);
console.log(result6);