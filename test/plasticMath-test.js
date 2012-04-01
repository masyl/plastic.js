var
//		plastic = require("../lib/plastic"),
		plastic = require("../lib-cov/plastic"),
    	vows = require('vows');
    	assert = require('assert');


vows.describe('plastic math module').addBatch({
	"With a plastic.math object" : {
		topic: function () {
			// Get a new plastic instance with the math module
			return plastic("math");
		},
		"do a bunch of operations": function (math) {
			// Operation: 4 * 3 = 12
			assert.equal(12, math.take(4).multipliedBy(3).value());

			// Operation: 4 * 3 = 12
			assert.deepEqual([12], math.take(4).multipliedBy(3).values());

			// Operation: (4 * 3) / 6 - 1 = 1
			assert.equal(1, math.take(4).multipliedBy(3).dividedBy(6).minus(1).value());

			// Operation: 4 * 3 + (3 / 2 + 4 * 2) = 23
			assert.equal(23, math
					.take(4)
					.log("context")
					.multipliedBy(3)
					.log("context")
					.plus(math
						.take(3)
						.dividedBy(2)
						.plus(4)
						.multipliedBy(2)
						.value()
					)
					.value()
			);
		}
	}


}).export(module);
