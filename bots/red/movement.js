import {BCAbstractRobot, SPECS} from 'battlecode';




function findClosestCastle(myLocationX,mylocationY, possibleCastleLocations,map,rob){
  var i = 0;
  var minLength = 4096 ;
  var length = 0;
  var closestIndex = -1;
  for (i = 0; i < possibleCastleLocations.length; i++) {
    length = 0;
    rob.log("on fun")
    rob.log(map[possibleCastleLocations[i][0]][possibleCastleLocations[i][1]]);
    if(map[possibleCastleLocations[i][0]][possibleCastleLocations[i][1]] == true){
      length = Math.abs(mylocationY - possibleCastleLocations[i][0]) + Math.abs(myLocationX - possibleCastleLocations[i][0]);
      if(length < minLength){
        minLength = length;
        closestIndex = i;
      }
    }
    
  }
  return closestIndex;
}

function getRandomPath(direction,openPaths){
  openPaths[direction[1]+1][direction[0]+1] = 0;
  openPaths[1][direction[0]+1] = 0;
  openPaths[direction[1]+1][1] = 0;
  var path = [];
  var found = false;
  var i;
  var j;
  for(i = 0;i < 3;i++){
    for(j = 0;j < 3;j++){
      if(openPaths[i][j] == 1){
        path[0] = i;
        path[1] = j;
        found = true;
        break;
      }
    }
    if(found == true){
      break;
    }
  }
}
//have to decide y and x locations
//should try for alwayx x,y
function getPossibleSteps(coor,map){
  var result = [[],[],[]];//[y][x]
  var i;
  var j;
  for(i = 0;i < 3;i++){
    for(j = 0;j < 3;j++){
      if(i == 1 && j == 1){
        result[i][j] = 0;
      }else{
        result[i][j] = map[coor[1]+i-1][coor[0]+j-1] == true ? 1 : 0;
      }
    }
  }
  return result;
}
//direction of coor2 in relation of coor1
function getDirection(coor1,coor2){
  var result = [0,0];//e-w,n-s,
  result[1] = (coor2[1] > coor1[1]) ? 1 : (coor2[1] < coor1[1]) ? -1 : 0
  result[0] = (coor2[0] > coor1[0]) ? 1 : (coor2[0] < coor1[0]) ? -1 : 0
  return result;
}
//this function gets the next step to take (will have to take into account different units in future
//only single step
function getNextStep(currentLocation,destination,map){
  var direction = getDirection(currentLocation,destination);
  var openPaths = getPossibleSteps(currentLocation,map);
  var newLocation = [currentLocation[0],currentLocation[1]];
  
  var moveAvailable = false;
  if(map[currentLocation[1]][currentLocation[0] + direction[0]] == true){
    newLocation[0] = currentLocation[0] + direction[0];
    moveAvailable = true;
  }
  if(map[currentLocation[1] + direction[1]][currentLocation[0]] == true){
    newLocation[1] = currentLocation[1] + direction[1];
    moveAvailable = true;
  }
  if(moveAvailable == true){
    return newLocation;
  }
  //else if could not move, need to figure out where to move to continue.
  //this could break if enter into tunnel
  
  
  return newLocation;
}


/*function findPathToCoordinateDFS(origin,destination,map){
  var S = [];
  S.push(origin);
  var found = false;
  var current;
  while(S.length > 0 || found == false){
    current = S.pop();
    
  }
}*/
//this function find the whole path to take from origin to destination
function findPathToCoordinate(origin,destination,map){
  var path = [];
  var nextStep = getNextStep(origin,destination,map);
  var i = 1;
  path[0] = [nextStep[0],nextStep[1]];
  while(nextStep[0] != destination[0] || nextStep[1] != destination[1]){
    nextStep = getNextStep(nextStep,destination,map);
    path[i] = [nextStep[0],nextStep[1]];
    i++;
  }
  return path;
  
}

