var
		plastic = require("../lib/plastic"),
    	assert = require('assert');


exports.testCompoundOperations = function(beforeExit, assert) {

	// Get a new plastic instance with the math module
	var math = plastic("math");

	// Operation: 4 * 3 = 12
	assert.equal(12, math.take(4).multipliedBy(3).value());

	// Operation: (4 * 3) / 6 - 1 = 1
	assert.equal(1, math.take(4).multipliedBy(3).dividedBy(6).minus(1).value());

	// Operation: 4 * 3 + (3 / 2 + 4 * 2) = 23
	assert.equal(23, math
			.take(4)
			.log("context")
			.multipliedBy(3)
			.plus(math
				.take(3)
				.dividedBy(2)
				.plus(4)
				.multipliedBy(2)
				.value()
			)
			.value()
	);

};
