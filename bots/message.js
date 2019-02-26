export function format_integer(int){
    if (int < 10){
        return String("0" + int);
    }
    return String(int);
}

export function transmit_location(r,location,range){
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