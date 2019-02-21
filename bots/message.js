export function format_integer(int){
    if (int < 10){
        return "0"+ int;
    }
    return String(int);
}

export function transmit_location(r,location,range){
    return r.signal(parseInt("1"+location.x+location.y), range);
}