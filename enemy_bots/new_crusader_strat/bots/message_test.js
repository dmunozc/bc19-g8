var ATTACK = 15
var GOTO = 14



exports.encode_attack = function(loc){

  return this.encode_location(loc) | ATTACK;
  
}

exports.encode_goto = function(loc){

  return this.encode_location(loc) | GOTO;
}
/**


0000 00 = 0
1111 11 = 63
**/
exports.encode_location = function(loc){

  
  xLocation = loc[0] << 10;
  yLocation = loc[1] << 4;
  return xLocation | yLocation;
  
}

/**
Format is:
4 MSB is what to do code
currently only 1111 and 1110 are reserved
next 6 MSB are y location
next 6MSB are x location
**/
exports.decode_location = function(radioNumber){
  radioNumber = radioNumber >> 4;
  yLocation = radioNumber & parseInt("0000000000111111",2);
  xLocation = (radioNumber & parseInt("0000111111000000",2)) >> 6;
  
  return [xLocation,yLocation];
}