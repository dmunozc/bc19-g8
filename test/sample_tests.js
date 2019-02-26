const movement = require('../bots/movement_test.js');
const assert = require('assert');

describe('Movement', () => {
describe('get_direction', function(){	
	//const output = [1,1];
	it('should return [1,1]', function(){
		assert.equal(movement.get_direction([0,0],[2,2]), [1,1]);
	});
});
});	