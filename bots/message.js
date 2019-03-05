
export function format_integer(int){
    if (int < 10){
        return String("0" + int);
    }
    return String(int);
}

export function transmit_location(r,location,range){
    r.log("1"+format_integer(location.x) + format_integer(location.y));
    return r.signal(parseInt("1"+format_integer(location.x)+format_integer(location.y)), range);
}

export function parse_message(r, visible){
    // r.log(visible);
    for (var i = 0; i < visible.length; i++){
        var sig = visible[i].signal;
        // If the signal is greater than 10, it must be a loc
        if (sig > 10 && visible[i].unit === 0){
            var xcoor = Math.floor(sig/100) - 100;
            var ycoor = (sig % 100);
            return {"x":xcoor, "y":ycoor};
        }
    }
    return {"x":-1, "y": -1};
}
export var ATTACK = 61440
export var GOTO = 57344



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
  var xLocation = loc[0] << 6;
  var yLocation = loc[1] << 0;
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
  //radioNumber = radioNumber >> 4;
  var yLocation = radioNumber & parseInt("0000000000111111",2);
  var xLocation = (radioNumber & parseInt("0000111111000000",2)) >> 6;
  
  return [xLocation,yLocation];
}