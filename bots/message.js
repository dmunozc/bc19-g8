export var ATTACK = 15
export var GOTO = 14



export function encode_attack(loc){
  return encode_location(loc) | ATTACK;
  
}

export function encode_goto(loc){
  return encode_location(loc) | GOTO;
}
/**


0000 00 = 0
1111 11 = 63
**/
export function encode_location(loc){
  var xLocation = loc[0] << 10;
  var yLocation = loc[1] << 4;
  return xLocation | yLocation;
  
}

/**
Format is:
4 MSB is what to do code
currently only 1111 and 1110 are reserved
next 6 MSB are y location
next 6MSB are x location
**/
export function decode_location(radioNumber){
  radioNumber = radioNumber >> 4;
  var yLocation = radioNumber & parseInt("000000111111",2);
  var xLocation = (radioNumber & parseInt("0000111111000000",2)) >> 6;
  
  return [xLocation,yLocation];
}