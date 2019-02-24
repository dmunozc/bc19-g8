// load Unit.js module
var test = require('unit.js');
var messages = require('../bots/message_test.js');


var temp;


var result1 = messages.encode_location([0,0]);
test.assert(result1 === 0);
result1 = messages.encode_location([0,1]);
console.log(result1);
test.assert(result1 === 16);
result1 = messages.encode_location([1,0]);
test.assert(result1 === 1024);
result1 = messages.encode_location([63,0]);
test.assert(result1 === 64512);
result1 = messages.encode_location([0,63]);
test.assert(result1 === 1008);
result1 = messages.encode_location([13,7]);
test.assert(result1 === 13424);
result1 = messages.encode_location([63,63]);
test.assert(result1 === 65520);

var result2 = messages.encode_attack([0,0]);
test.assert(result2 === 15);
result2 = messages.encode_attack([63,63]);
test.assert(result2 === 65535);
result2 = messages.encode_attack([12,10]);
test.assert(result2 === 12463);

temp = [0,0]
var result3 = messages.decode_location(messages.encode_attack(temp));
test.assert(result3[0] === temp[0]);
test.assert(result3[1] === temp[1]);
temp = [15,12]
result3 = messages.decode_location(messages.encode_attack(temp));
test.assert(result3[0] === temp[0]);
test.assert(result3[1] === temp[1]);
temp = [63,63]
result3 = messages.decode_location(messages.encode_attack(temp));
test.assert(result3[0] === temp[0]);
test.assert(result3[1] === temp[1]);
