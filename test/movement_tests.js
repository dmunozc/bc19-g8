// load Unit.js module
var test = require('unit.js');
var movement = require('../bots/movement_test.js');
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
           //x: 0    1    2     3    4   5    6     7    y:  
var map1 =   [[true,true,true,true,true,true,true,true],//0
              [true,true,true,true,true,true,true,true],//1
              [true,true,true,true,true,true,true,true],//2
              [true,true,false,false,false,true,true,true],//3
              [true,true,true,true,true,true,true,true],//4
              [true,true,true,true,true,true,true,true],//5
              [true,true,true,true,true,true,true,true],//6
              [true,true,true,true,true,true,true,true]];//7              
      

      
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
//in middle of closed map
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
result6 = movement.find_path_to_coordinate([0,0],[7,7],openMap,{'unit':3});
test.assert(result6[result6.length-1][0] === 7);
test.assert(result6[result6.length-1][1] === 7);
//console.log(result6);
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

result6 = movement.find_path_to_coordinate([13,5],[13,45],mapTest,{'unit':3});
test.assert(result6[result6.length-1][0] === 13);
test.assert(result6[result6.length-1][1] === 45);


/*Test generate_open_list(currentLocation,radius,map,previousPathsTaken)*/
var result7;
result7 = movement.generate_open_list([0,0],1,openMap,[]);
test.assert(result7.length === 2);
result7 = movement.generate_open_list([0,0],2,openMap,[]);
test.assert(result7.length === 5);
result7 = movement.generate_open_list([3,3],1,openMap,[]);
test.assert(result7.length === 4);
result7 = movement.generate_open_list([3,3],2,openMap,[]);
test.assert(result7.length === 12);
result7 = movement.generate_open_list([3,4],3,map1,[]);
test.assert(result7.length === 25);
result7 = movement.generate_open_list([3,4],3,map1,[[3-3,4+0],[3-2,4-2],[3+1,4+1],[3+3,4+0]]);
test.assert(result7.length === 21);

/*Test calculate_open_list_g(openList)*/
var result8;
temp = movement.generate_open_list([0,0],1,openMap,[]);
result8 = movement.calculate_open_list_g(temp,1);
test.assert(result8.length === 2);
temp = movement.generate_open_list([0,0],2,openMap,[]);
result8 = movement.calculate_open_list_g(temp,1);
test.assert(result8.length === 5);
temp = movement.generate_open_list([3,3],1,openMap,[]);
result8 = movement.calculate_open_list_g(temp,1);
test.assert(result8.length === 4);
temp = movement.generate_open_list([3,3],2,openMap,[]);
result8 = movement.calculate_open_list_g(temp,1);
test.assert(result8.length === 12);
temp = movement.generate_open_list([3,4],3,map1,[]);
result8 = movement.calculate_open_list_g(temp,1);
test.assert(result8.length === 25);
temp = movement.generate_open_list([3,4],3,map1,[[3-3,4+0],[3-2,4-2],[3+1,4+1],[3+3,4+0]]);
result8 = movement.calculate_open_list_g(temp,1);
test.assert(result8.length === 21);

/*Test calculate_open_list_h(currentLocation,destination,openList)*/
var result9;
temp = movement.generate_open_list([0,0],1,openMap,[]);
result9 = movement.calculate_open_list_h([0,0],[4,4],temp);
test.assert(result9.length === 2);
temp = movement.generate_open_list([0,0],2,openMap,[]);
result9 = movement.calculate_open_list_h([0,0],[4,4],temp);
test.assert(result9.length === 5);
temp = movement.generate_open_list([3,3],1,openMap,[]);
result9 = movement.calculate_open_list_h([3,3],[0,0],temp);
test.assert(result9.length === 4);
temp = movement.generate_open_list([3,3],2,openMap,[]);
result9 = movement.calculate_open_list_h([3,3],[0,0],temp);
test.assert(result9.length === 12);
temp = movement.generate_open_list([3,4],3,map1,[]);
result9 = movement.calculate_open_list_h([3,3],[0,0],temp);
test.assert(result9.length === 25);
temp = movement.generate_open_list([3,4],3,map1,[[3-3,4+0],[3-2,4-2],[3+1,4+1],[3+3,4+0]]);
result9 = movement.calculate_open_list_h([3,3],[0,0],temp);
test.assert(result9.length === 21);


/*Test get_next_step_astar_fuel(currentLocation,destination,map,previousPathsTaken,radius)*/
var result10;
result10 = movement.get_next_step_astar_fuel([1,1],[0,5],openMap,[],3);
//console.log(result10);
result10 = movement.get_next_step_astar_fuel(result10,[0,5],openMap,[],3);
//console.log(result10);

/*Test get_next_step_astar_turn(currentLocation,destination,map,previousPathsTaken,radius)*/
var result11;
result11 = movement.get_next_step_astar_turn([1,1],[0,5],openMap,[],3);
//console.log(result11);
result11 = movement.get_next_step_astar_turn(result11,[0,5],openMap,[],3);
//console.log(result11);


/*Test get_absolute_possible_square_checkerboard_steps_list(coor,map)*/
var result12;
result12 = movement.get_absolute_possible_square_checkerboard_steps_list([0,0],openMap);
test.assert(result12.length === 1);
result12 = movement.get_absolute_possible_square_checkerboard_steps_list([3,3],openMap);
test.assert(result12.length === 4);
result12 = movement.get_absolute_possible_square_checkerboard_steps_list([3,2],map1);
test.assert(result12.length === 2);

/*Test get_next_checkerboard_step(currentLocation,map,visibleRobots,previousPathsTaken)*/
var result13;
var robotMe = {"type":"robot","id":2022,"team":0,"x":2,"y":4,"unit":2,"turn":6,"signal":-1,"signal_radius":-1};
var robotOne = {"type":"robot","id":2022,"team":0,"x":3,"y":3,"unit":2,"turn":6,"signal":-1,"signal_radius":-1};
var robotTwo = {"type":"robot","id":2022,"team":0,"x":1,"y":3,"unit":2,"turn":6,"signal":-1,"signal_radius":-1};
var robotThree = {"type":"robot","id":2022,"team":0,"x":3,"y":1,"unit":2,"turn":6,"signal":-1,"signal_radius":-1};
var robotFour = {"type":"robot","id":2022,"team":0,"x":2,"y":4,"unit":2,"turn":6,"signal":-1,"signal_radius":-1};
var castle = {"type":"robot","id":2022,"team":0,"x":1,"y":1,"unit":0,"turn":6,"signal":-1,"signal_radius":-1}
//result13 = movement.get_next_checkerboard_step([2,2],openMap,[robotMe,castle],[],-5);

//result13 = movement.get_next_checkerboard_step([2,2],openMap,[robotMe,castle,robotOne],[[1,1]],-5);
//result13 = movement.get_next_checkerboard_step([2,2],openMap,[robotMe,castle,robotOne,robotTwo],[[1,1]],-5);
//result13 = movement.get_next_checkerboard_step([2,2],openMap,[robotMe,castle,robotOne,robotTwo,robotThree],[[1,1]],-5);
//result13 = movement.get_next_checkerboard_step([2,3],openMap,[robotMe,castle,robotOne,robotTwo,robotThree],[[1,1],[2,2]],-5);
//result13 = movement.get_next_checkerboard_step([2,3],openMap,[robotMe,castle,robotOne,robotTwo,robotThree,robotFour],[[1,1],[2,2]],-5);
result13 = movement.get_next_checkerboard_step([2,4],openMap,[robotMe,castle,robotOne,robotTwo,robotThree,robotFour],[[1,1],[2,2],[2,3]],-5);
console.log(result13);