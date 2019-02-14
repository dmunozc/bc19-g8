//array of possible 1 step movements from relative location
var relativeCoors = [[[-1,-1],[0,-1],[1,-1]],[[-1,0],[0,0],[1,0]],[[-1,1],[0,1],[1,1]]];
//from SPECS
var CASTLE = 0;
var CHURCH = 1;
var PILGRIM = 2;
var CRUSADER = 3;
var PROPHET = 4;
var PREACHER = 5

var MOVEMENT_RADIUS = [0,0,2,3,2,2];
/**
 * Checks is an x,y coordinate is present in a list of x,y coordinates
 * @coor	list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @paths list A list of x,y coordinates list 
 * @returntrue if coor is in paths, false otherwise
 * Example:
 * @coor = [5,6]
 * @paths = [[0,0],[2,1],[10,15]]
 * @return = false
 */
export function check_if_coor_in_path(coor,paths){
  var i;
  for(i = 0; i < paths.length;i++){
    if(coor[0] == paths[i][0] && coor[1] == paths[i][1]){
      return true;
    }
  }
  return false;
}
/**
 * Gives a list of x,y coordinate list that contains the relative locations that a unit can move to based on the map and its radius
 * @coor	list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @map list Map from battlecode
 * @radius int The radius of movement of the unit
 * @return	list A list of x,y coordinates list 
 * Example:
 * @coor = [5,6]
 * @map = Battlecode map, imagine everything is open
 * @radius = 2
 * @return = [[-2,0],[-1,-1],[-1,0],[-1,1],[0,-2],[0,-1],[0,1],[0,2],[1,-1],[1,0],[1,1],[2,0]]
 */
export function get_possible_step_list(coor,map,radius){
  var i;
  var j;
  var k = 0;
  var result = [];
  for(i = -radius; i<=radius; i++){
    for(j = -radius; j<=radius; j++){
      if(get_distance([0,0],[i,j]) <= radius){
        if(!(coor[0] + i < 0 || coor[0] + i >= map.length || coor[1] + j < 0 || coor[1] + j >= map.length || (i == 0 && j == 0))){
          if(map[coor[1] + j][coor[0] + i] == true){
          result[k] = [i,j];
          k++;
          }
        }
      }
    }
  }
  return result;
}
/**
 * Gives a random member from a list
 * @list list of any objects
 * @return	random member of the given list
 * Example:
 * @list = [[1,6],[2,4],[6,2]]
 * @return = [6,2]
 */
export function get_random_from_list(list){
  return list[Math.floor(Math.random() * (list.length) )];
}
/**
 * Given two coordinates it returns a two value list containing the direction to move
 * with respect to the first coordinate to the second coordinate
 * resulting list first value is:
 *    -1 if should move east
 *    1 if should move west
 *    0 if should stay in place
 * resulting list second value is:
 *    -1 if should move north
 *    1 if should move south
 *    0 if should stay in place
 * @coor1 list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @coor2 list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @return	list	A list that contains an x,y coordinate.
 * Example:
 * @coor1 = [2,2]
 * @coor2 = [4,4]
 * @return = [1,1]
 * Example:
 * @coor1 = [2,2]
 * @coor2 = [2,4]
 * @return = [0,1]
 * Example:
 * @coor1 = [4,4]
 * @coor2 = [2,4]
 * @return = [-1,0]
 */
export function get_direction(coor1,coor2){
  var result = [0,0];//e-w,n-s,
  result[1] = (coor2[1] > coor1[1]) ? 1 : (coor2[1] < coor1[1]) ? -1 : 0
  result[0] = (coor2[0] > coor1[0]) ? 1 : (coor2[0] < coor1[0]) ? -1 : 0
  return result;
}
/**
 * Given a direction list (gotten from get_direction()), the movement radius, the battlecode map, and 
 * a current location, it returns the maximum optimum value that a unit can move in relative units
 * It takes care to not go out of bounds in map
 * @direction list	irection list (gotten from get_direction())
 * @radius int 
 * @map list Battlecode map
 * @currentLocation list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @return	list	A list that contains an x,y coordinate.
 * Example:
 * @direction = [0,1]
 * @radius = 3
 * @map = open map
 * @currentLocation = [9,9]
 * @return = [0,3]
 * Example:
 * @direction = [1,1]
 * @radius = 3
 * @map = open map
 * @currentLocation = [6,6]
 * @return = [2,2]
 */
export function get_max_movement(direction,radius,map,currentLocation){
  var result = [0,0];
  var dx,dy;
  //TODO might break if dy and dx reach 0
  if(direction[0] == 0 || direction[1] == 0){
    if(direction[0] == 0){
      //
      dy = radius;
      while( (currentLocation[1] + (direction[1] * dy)) >= map.length){
        dy--;
      }
      result[1] = direction[1] * dy;
    }
    else if(direction[1] == 0){
      //
      dx = radius;
      while((currentLocation[0] + (direction[0] * dx)) >= map.length){
        dx--;
      }
      result[0] = direction[0] * dx;
    }
    return result;
  }
  dx = (radius-1);
  while(dx > 0 && (currentLocation[0] + (direction[0] * dx)) >= map.length){
    dx--;
  }
  dy = (radius-1);
  while(dy > 0 && ( currentLocation[1] + (direction[1] * dy)) >= map.length){
    dy--;
  }
  
  return [direction[0] * dx,direction[1] * dy];
  
}
/**
 * Gives distance between two points
 * @coor1 list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @coor2 list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @return double The calculated distance
 */
export function get_distance(coor1,coor2){
  if(typeof coor1[1] === 'undefined' || typeof coor2[1] === 'undefined'){
    throw "get_distance vars not an array";
  }
  return Math.sqrt(Math.pow(coor1[0] - coor2[0],2) + Math.pow(coor1[1] - coor2[1],2));
}


/**
 * Generates an array of relative x,y coordinates that a unit from its current location can move to 
 * @currentLocation list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @radius int 
 * @map list Battlecode map
 * @previousPathsTaken list A list of multiple x,y coordinates that contains the previous paths taken, can be empty
 * @return list possible coordinates a unit can move
 */
export function generate_open_list(currentLocation,radius,map,previousPathsTaken){
  //this gives relative x,y location only based on map
  var openPaths = get_possible_step_list(currentLocation,map,radius);
  var i;
  for(i = 0; i < openPaths.length;i++){
    if(check_if_coor_in_path([openPaths[i][0] + currentLocation[0], openPaths[i][1] + currentLocation[1]], previousPathsTaken) == true){
      openPaths.splice(i,1);
      i--;
    }
  }
  return openPaths
}
/**
 * Generates a list with the same index position in openList denoting its g value
 * g value is the movement cost to move from the starting point to a given square on the grid, following the path generated to get there.
 * @openList list possible coordinates a unit can move
 * @return list of g values in same index as openList
 */
export function calculate_open_list_g(openList,type){
  var i;
  var result = [];
  for(i = 0; i < openList.length;i++){
    if(type == 1){//fuel
    result.push(get_distance([0,0],openList[i]))
    }else{ //turn
      result.push(1.0)
    }
  }
  return result;
}

/**
 * Generates a list with the same index position in openList denoting its h value
 * h value the estimated movement cost to move from that given square on the grid to the final destination.
 * I am using euclidian distance, but could explore using diagonal distance for pilgrim
 * @currentLocation list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @destination list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @openList list possible coordinates a unit can move
 * @return list of h values in same index as openList
 */
export function calculate_open_list_h(currentLocation,destination,openList){
  var i;
  var result = [];
  var potentialMove = []
  for(i = 0; i < openList.length;i++){
    potentialMove[0] = openList[i][0] + currentLocation[0];
    potentialMove[1] = openList[i][1] + currentLocation[1];
    result.push(get_distance(potentialMove,destination))
  }
  return result;
}

export function get_next_step_astar_fuel(currentLocation,destination,map,previousPathsTaken,radius){
  return get_next_step_astar(currentLocation,destination,map,previousPathsTaken,radius,1)
}

export function get_next_step_astar_turn(currentLocation,destination,map,previousPathsTaken,radius){
  return get_next_step_astar(currentLocation,destination,map,previousPathsTaken,radius,0)
}

export function get_next_step_astar(currentLocation,destination,map,previousPathsTaken,radius,type){
  if(get_distance(currentLocation,destination) < radius){
    return destination;
  }
  var openList = [];
  var gList = [];
  var hList = [];
  var minList = [];
  var currentMin;
  var i;
  var chosenMin;
  //generate open list (list of squares that I can move based on the radius, map, visible robots, previous path)
  openList =  generate_open_list(currentLocation,radius,map,previousPathsTaken);
  //calculate g for open list
  gList= calculate_open_list_g(openList, type);
  //calculate h for open list
  hList = calculate_open_list_h(currentLocation,destination,openList);
  //pick lowest g+h value as next step
  //  if there is more than one g+h min value, pick one with lowest h cost
  currentMin = gList[0]+hList[0];
  for(i = 0; i< openList.length; i++){
    if(gList[i]+hList[i] < currentMin){
      currentMin = gList[i]+hList[i];
    }
  }
  for(i = 0; i< openList.length; i++){
    if(gList[i]+hList[i] === currentMin){
      minList.push(i);
    }
  }
  if(minList.length > 1){
    currentMin = hList[minList[0]];
    chosenMin = minList[0];
    for(i = 0; i < minList.length; i++){
      if(hList[minList[i]] < currentMin){
        currentMin = hList[minList[i]];
        chosenMin = minList[i];
      }
    }
  }else{
    chosenMin = minList[0];
  }
  
  return [currentLocation[0] + openList[chosenMin][0],currentLocation[1] + openList[chosenMin][1]];
}

/**
 * Given a current location coordinate, destination coordinate, a map, a list of previous visited coordinates, and the unit radus
 * It returns the greedy next step to take from the current location to reach the coordinate. Takes into account the unit radius,
 * unpassable tiles in map. 
 * It prevents an infite loop by checking against a list of previous visited coordinates, so it does not go back and forth the same place
 * You can also use the list of previous coordinates to add any coordinate you dont want to visit (as is a list of current occupied tiles by robots or buildings)
 * @currentLocation list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @destination list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @map list Battlecode map
 * @previousPathsTaken list A list of coordinate list
 * @radius int 
 * @return	list	A list that contains an x,y coordinate of the next step to make in absolute units
 * Example:
 * @currentLocation = [0,0]
 * @destination = [10,10]
 * @map = open map
 * @previousPathsTaken = []
 * @radius = 3 
 * @return = [2,2]
 * Example:
 * @currentLocation = [0,0]
 * @destination = [10,10]
 * @map = open map, unpassable tile at 2,2
 * @previousPathsTaken = []
 * @radius = 3 
 * @return = [3,0]  
 */
export function get_next_step(currentLocation,destination,map,previousPathsTaken,radius){
  
  //r.log(currentLocation);
  //r.log(destination);
  if(get_distance(currentLocation,destination) < radius){
    return destination;
  }
  
  //generate open list (list of squares that I can move based on the radius, map, visible robots, previous path)
  //calculate g for open list
  //calculate h for open list
  //pick lowest g+h value as next step
  //  if there is more than one g+h min value, pick one with lowest h cost
  
  var direction = get_direction(currentLocation,destination);
  var maxMovement = get_max_movement(direction,radius,map,currentLocation);
  
  var openPaths;// = get_possible_steps(currentLocation,map);
  var newLocation = [currentLocation[0],currentLocation[1]];
  
  var moveAvailable = false;
  var i;
  if( (maxMovement[0] != 0 ||  maxMovement[1] != 0) && map[newLocation[1] + maxMovement[1]][newLocation[0] + maxMovement[0]] == true){
    newLocation[0] = newLocation[0] + maxMovement[0];
    newLocation[1] = newLocation[1] + maxMovement[1];
    moveAvailable = true;
  }
  for(i = maxMovement[0];i > 0 &&  !moveAvailable; i--){
    if( map[newLocation[1]][newLocation[0] + i] == true){
      newLocation[0] = newLocation[0] + i;
      break;
    }
  }
  for(i = maxMovement[1];i > 0 &&  !moveAvailable; i--){
    if( map[newLocation[1] + i][newLocation[0]] == true){
      newLocation[1] = newLocation[1] + i;
      break;
    }
  }
  if(!moveAvailable && (newLocation[0] != currentLocation[0] || newLocation[1] != currentLocation[1])){
    moveAvailable = true;
  }
  
  if(moveAvailable == true){
    if(!check_if_coor_in_path(newLocation,previousPathsTaken)){//this option does not allow backtracking
      return newLocation;
    }
    newLocation = [currentLocation[0],currentLocation[1]];
  }
  openPaths = get_possible_step_list(currentLocation,map,radius);
  //else if could not move, need to figure out where to move to continue.
  //this could break if enter into tunnel
  //return random open path
  var newPath = get_random_from_list(openPaths);
  //console.log(check_if_coor_in_path(newPath,previousPathsTaken));
  //console.log([newLocation[0] + newPath[0],newLocation[1] + newPath[1]]);
  //console.log(check_if_coor_in_path([newLocation[0] + newPath[0],newLocation[1] + newPath[1]],previousPathsTaken));
  while(check_if_coor_in_path([newLocation[0] + newPath[0],newLocation[1] + newPath[1]],previousPathsTaken)){ //this option does not allow backtracking
    newPath = get_random_from_list(openPaths);
  }
  
  return [newLocation[0] + newPath[0],newLocation[1] + newPath[1]];
}


/**
 * Given an origin and destination coordinates, along with a map and unit type, gives a list of absolute coordinates that are the
 * steps to take to reach the destination with the current state of the map
 * @origin list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @destination list	A list that contains an x,y coordinate. Always of size 2 and x is always 0, y is always 1
 * @map list Battlecode map
 * @unit int As defined by the battlecode SPECS
 * @return	list	A list of x,y coordinates that start at origin and reach destination
 */
export function find_path_to_coordinate(origin,destination,map,unit){
  var path = [];
  var nextStep = get_next_step(origin,destination,map,path,MOVEMENT_RADIUS[unit.unit]);
  var i = 1;
  path[0] = [nextStep[0],nextStep[1]];
  while(nextStep[0] != destination[0] || nextStep[1] != destination[1]){
    //r.log(i);
    nextStep = get_next_step(nextStep,destination,map,path,MOVEMENT_RADIUS[unit.unit]);
    path[i] = [nextStep[0],nextStep[1]];
    i++;
  }
  return path;
  
}

/**
 * Given the object of visible robots (from the main helper function getVisibleRobots()) it returns a 
 * list of x,y coordinate list of their locations.
 * @visible object The visible robots object from the helper function
 * @return	list	A list of x,y coordinates with the locations of the robots
 */
export function get_visible_robots_list(visible){
  var res = [];
  for (var i = 0; i < visible.length; i++){
    res.push([visible[i].x,visible[i].y]);
  }
  return res;
}
export function get_possible_square_steps_list(coor,map){
  var i;
  var j;
  var k = 0;
  var result = [];
  for(i = -1; i<=1; i++){
    for(j = -1; j<=1; j++){
      if(!(coor[0] + i < 0 || coor[0] + i >= map.length || coor[1] + j < 0 || coor[1] + j >= map.length || (i == 0 && j == 0))){
        if(map[coor[1] + j][coor[0] + i] == true){
        result[k] = [i,j];
        k++;
        }
      }
    }
  }
  return result;
}


export function get_open_places_castle(coor,map,visibleRobots){
  var robotsList = get_visible_robots_list(visibleRobots);
  var i;
  var j;
  var k = 0;
  var result = [];
  for(i = -1; i<=1; i++){
    for(j = -1; j<=1; j++){
      if(!(coor[0] + i < 0 || coor[0] + i >= map.length || coor[1] + j < 0 || coor[1] + j >= map.length || (i == 0 && j == 0))){
        if(map[coor[1] + j][coor[0] + i] == true && !check_if_coor_in_path([coor[0] + i,coor[1] + j],robotsList)){
          result[k] = [i,j];
          k++;
        }
      }
    }
  }
  return result;
}


export function get_absolute_possible_square_checkerboard_steps_list(coor,map){
  var i;
  var j;
  var k = 0;
  var result = [];
  for(i = -1; i<=1; i++){
    for(j = -1; j<=1; j++){
      if((i == 0 && j == 0) || (i == 1 && j == 0) || (i == -1 && j == 0) || (i == 0 && j == 1) || (i == 0 && j == -1)){
        continue;
      }
      if(!(coor[0] + i < 0 || coor[0] + i >= map.length || coor[1] + j < 0 || coor[1] + j >= map.length)){
        if(map[coor[1] + j][coor[0] + i] == true){
          result[k] = [i+coor[0],j+coor[1]];
          k++;
        }
      }
    }
  }
  return result;
}

export function get_absolute_impossible_square_checkerboard_steps_list(coor,map){
  var i;
  var j;
  var k = 0;
  var result = [];
  for(i = -1; i<=1; i++){
    for(j = -1; j<=1; j++){
      if((i == 0 && j == 0) || (i == 1 && j == 0) || (i == -1 && j == 0) || (i == 0 && j == 1) || (i == 0 && j == -1)){
        result[k] = [i+coor[0],j+coor[1]];
        k++;
      }
      if(!(coor[0] + i < 0 || coor[0] + i >= map.length || coor[1] + j < 0 || coor[1] + j >= map.length)){
        if(map[coor[1] + j][coor[0] + i] == true){
          continue;
        }
      }
    }
  }
  return result;
}

//[{"type":"robot","id":2022,"team":0,"x":3,"y":0,"unit":2,"turn":6,"signal":-1,"signal_radius":-1},{"type":"robot","id":3650,"team":0,"x":4,"y":2,"unit":0,"turn":8,"signal":-1,"signal_radius":-1},{"type":"robot","id":3594,"team":0,"x":4,"y":1,"unit":4,"health":20,"karbonite":0,"fuel":0,"turn":1,"signal":0,"signal_radius":0,"time":120},{"type":"robot","id":1218,"team":0,"x":6,"y":2,"unit":2,"turn":7,"signal":-1,"signal_radius":-1},{"type":"robot","id":1303,"team":0,"x":6,"y":1,"unit":2,"turn":8,"signal":-1,"signal_radius":-1}]
export function get_next_checkerboard_step(currentLocation,map,visibleRobots,previousPathsTaken,r){
  
  var closeRobots = visibleRobots.filter(robot => (get_distance(currentLocation, [robot.x,robot.y]) <= Math.sqrt(8) && !(robot.x == currentLocation[0] && robot.y == currentLocation[1])  && robot.unit >=2));
  var openPaths;
  var otherOpenPaths = [];
  var otherClosedPaths = [];
  var loc;
  var i;
  var j;
  var tempPath;
  var otherRobotsLocations = [];
  var newPaths;
  var chosenPath;
  //r.log(closeRobots);
  if(closeRobots.length > 0){
    for(i = 0; i < closeRobots.length; i++){
      otherRobotsLocations[i] = [closeRobots[i].x,closeRobots[i].y];
      otherOpenPaths = otherOpenPaths.concat(get_absolute_possible_square_checkerboard_steps_list(otherRobotsLocations[i],map));
      otherClosedPaths = otherClosedPaths.concat(get_absolute_impossible_square_checkerboard_steps_list(otherRobotsLocations[i],map));
    }
    //console.log("-----------");
    
    //console.log(otherClosedPaths);
    //console.log("-----------");
    for(i = 0; i < otherOpenPaths.length; i++){
      if(check_if_coor_in_path(otherOpenPaths[i], otherRobotsLocations.concat(otherClosedPaths)) == true){
        otherOpenPaths.splice(i,1);
        i--;
      }
    }
    //console.log(otherRobotsLocations);
    //console.log(otherOpenPaths);
    for(i = 0; i < otherOpenPaths.length; i++){
      //is any of the other of both open paths at sqrt(2) distace of me? If yes move there
      var temp = get_distance(otherOpenPaths[i],currentLocation);
      //console.log(temp);
      //console.log(otherOpenPaths[i]);
      if(temp <= Math.sqrt(2) && temp > 0 && check_if_coor_in_path(otherOpenPaths[i],previousPathsTaken) == false){
        console.log("return 502");
        return otherOpenPaths[i];
      }
    }
    //else get mine if see if I can move
    openPaths = get_absolute_possible_square_checkerboard_steps_list(currentLocation,map);
    
    for(i = 0; i < openPaths.length; i++){
      if(check_if_coor_in_path(openPaths[i], otherRobotsLocations.concat(previousPathsTaken.concat(otherClosedPaths))) == true){
        openPaths.splice(i,1);
        i--;
      }
    }
    //console.log(openPaths);
    //console.log(openPaths.length);
    if(openPaths.length > 0){
      return get_random_from_list(openPaths);
    }
    return currentLocation;
  }else{
    openPaths = get_absolute_possible_square_checkerboard_steps_list(currentLocation,map);
    chosenPath = get_random_from_list(openPaths);
    while(check_if_coor_in_path(chosenPath,previousPathsTaken)){ //this option does not allow backtracking
      chosenPath = get_random_from_list(openPaths);
    }
    return chosenPath;
  }
  return;
}

export function resource_map_to_coor_list(map,r){
  var i;
  var j;
  var res = [];
  //r.log("dsdsdss");
  //r.log(map);
  for(i =0; i < map.length; i++){
    for(j =0; j < map[i].length; j++){
      if(map[i][j] == true){
        //r.log("here sdffds");
        res.push([j,i]);
      }
    }
  }
  return res;
}
