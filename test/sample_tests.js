const movement = require('../bots/movement_test.js');
const assert = require('assert');

describe('Movement', () => {
describe('get_direction', function(){	
	//const output = [1,1];
	it('should return [1,1]', function(){
		var result = movement.get_direction([0,0],[2,2]);
		assert.equal(result[0], 1);
		assert.equal(result[1], 1);
	});
});
});	