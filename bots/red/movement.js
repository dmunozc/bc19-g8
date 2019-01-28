var relativeCoors = [[[-1,-1],[0,-1],[1,-1]],[[-1,0],[0,0],[1,0]],[[-1,1],[0,1],[1,1]]];
var CASTLE = 0;
var CHURCH = 1;
var PILGRIM = 2;
var CRUSADER = 3;
var PROPHET = 4;
var PREACHER = 5

var MOVEMENT_RADIUS = [0,0,2,3,2,2];

export function check_if_coor_in_path(coor,paths){
  var i;
  for(i = 0; i < paths.length;i++){
    if(coor[0] == paths[i][0] && coor[1] == paths[i][1]){
      return true;
    }
  }
  return false;
}

export function get_random_path(direction,openPaths){
  openPaths[direction[1]+1][direction[0]+1] = 0; //making impassable what was tried before
  openPaths[1][direction[0]+1] = 0;  //making impassable what was tried before
  openPaths[direction[1]+1][1] = 0;  //making impassable what was tried before
  //this will break if everything in openPaths is impassable
  var  i = 0;
  var  j = 0;
  var found = false;
  while(!found){
    i = Math.floor(Math.random() * (3) );
    j = Math.floor(Math.random() * (3) );
    if(openPaths[i][j] == 1){
      found = true;
    }
  }
  return relativeCoors[i][j];
}
//have to decide y and x locations
//should try for alwayx x,y
export function get_possible_steps(coor,map){
  var result = [[],[],[]];//[y][x]
  var i;
  var j;
  for(i = 0;i < 3;i++){
    for(j = 0;j < 3;j++){
      //console.log(result.toString());
      if(i == 1 && j == 1){
        result[i][j] = 0;
      }else{
        if(coor[1]+i-1 < 0 || coor[1]+i-1 >= map.length || coor[0]+j-1 < 0 || coor[0]+j-1 >= map.length){
          result[i][j] = 0;
        }else{
          result[i][j] = map[coor[1]+i-1][coor[0]+j-1] == true ? 1 : 0;
        }
      }
    }
  }
  return result;
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

export function get_random_from_list(list){
  return list[Math.floor(Math.random() * (list.length) )];
}
//direction of coor2 in relation of coor1
export function get_direction(coor1,coor2){
  var result = [0,0];//e-w,n-s,
  result[1] = (coor2[1] > coor1[1]) ? 1 : (coor2[1] < coor1[1]) ? -1 : 0
  result[0] = (coor2[0] > coor1[0]) ? 1 : (coor2[0] < coor1[0]) ? -1 : 0
  return result;
}

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

export function get_distance(coor1,coor2){
  return Math.sqrt(Math.pow(coor1[0] - coor2[0],2) + Math.pow(coor1[1] - coor2[1],2));
}
//this function gets the next step to take (will have to take into account different units in future
//only single step
export function get_next_step(currentLocation,destination,map,currentPath,radius){
  
  //r.log(currentLocation);
  //r.log(destination);
  if(get_distance(currentLocation,destination) < radius){
    return destination;
  }
  
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
    if(!check_if_coor_in_path(newLocation,currentPath)){//this option does not allow backtracking
      return newLocation;
    }
    newLocation = [currentLocation[0],currentLocation[1]];
  }
  openPaths = get_possible_step_list(currentLocation,map,radius);
  //else if could not move, need to figure out where to move to continue.
  //this could break if enter into tunnel
  //return random open path
  var newPath = get_random_from_list(openPaths);
  //console.log(check_if_coor_in_path(newPath,currentPath));
  //console.log([newLocation[0] + newPath[0],newLocation[1] + newPath[1]]);
  //console.log(check_if_coor_in_path([newLocation[0] + newPath[0],newLocation[1] + newPath[1]],currentPath));
  while(check_if_coor_in_path([newLocation[0] + newPath[0],newLocation[1] + newPath[1]],currentPath)){ //this option does not allow backtracking
    newPath = get_random_from_list(openPaths);
  }
  
  return [newLocation[0] + newPath[0],newLocation[1] + newPath[1]];
}

//this function find the whole path to take from origin to destination
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


export function get_visible_robots_list(visible){
  var res = [];
  for (var i = 0; i < visible.length; i++){
    res.push([visible[i].x,visible[i].y]);
  }
  return res;
}
