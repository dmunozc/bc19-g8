var relativeCoors = [[[-1,-1],[0,-1],[1,-1]],[[-1,0],[0,0],[1,0]],[[-1,1],[0,1],[1,1]]];


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
//direction of coor2 in relation of coor1
export function get_direction(coor1,coor2){
  var result = [0,0];//e-w,n-s,
  result[1] = (coor2[1] > coor1[1]) ? 1 : (coor2[1] < coor1[1]) ? -1 : 0
  result[0] = (coor2[0] > coor1[0]) ? 1 : (coor2[0] < coor1[0]) ? -1 : 0
  return result;
}
//this function gets the next step to take (will have to take into account different units in future
//only single step
export function get_next_step(currentLocation,destination,map,currentPath){
  var direction = get_direction(currentLocation,destination);
  var openPaths = get_possible_steps(currentLocation,map);
  var newLocation = [currentLocation[0],currentLocation[1]];
  
  var moveAvailable = false;
  if(newLocation[0] + direction[0] != newLocation[0]  && map[newLocation[1]][newLocation[0] + direction[0]] == true){
    newLocation[0] = newLocation[0] + direction[0];
    moveAvailable = true;
  }
  if(newLocation[1] + direction[1] != newLocation[1] && map[newLocation[1] + direction[1]][newLocation[0]] == true){
    newLocation[1] = newLocation[1] + direction[1];
    moveAvailable = true;
  }
  if(moveAvailable == true){
    if(!check_if_coor_in_path(newLocation,currentPath)){//this option does not allow backtracking
      return newLocation;
    }
    newLocation = [currentLocation[0],currentLocation[1]];
  }
  //else if could not move, need to figure out where to move to continue.
  //this could break if enter into tunnel
  //return random open path
  var newPath = get_random_path(direction,openPaths);
  //console.log(check_if_coor_in_path(newPath,currentPath));
  //console.log([newLocation[0] + newPath[0],newLocation[1] + newPath[1]]);
  //console.log(check_if_coor_in_path([newLocation[0] + newPath[0],newLocation[1] + newPath[1]],currentPath));
  while(check_if_coor_in_path([newLocation[0] + newPath[0],newLocation[1] + newPath[1]],currentPath)){ //this option does not allow backtracking
    newPath = get_random_path(direction,openPaths);
  }
  
  return [newLocation[0] + newPath[0],newLocation[1] + newPath[1]];
}

//this function find the whole path to take from origin to destination
export function find_path_to_coordinate(origin,destination,map,r){
  var path = [];
  var nextStep = get_next_step(origin,destination,map,path);
  var i = 1;
  path[0] = [nextStep[0],nextStep[1]];
  while(nextStep[0] != destination[0] || nextStep[1] != destination[1]){
    //r.log(i);
    nextStep = get_next_step(nextStep,destination,map,path);
    path[i] = [nextStep[0],nextStep[1]];
    i++;
  }
  return path;
  
}
