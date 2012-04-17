var
		plastic = require("../lib-cov/plastic");

describe('With the plastic math module', function () {
	var math = plastic("math");
	describe("and a plastic.math object", function () {
		it("we can resolve this operation: (4 * 3) / 6 - 1 = 1", function () {
			math().take(4).multipliedBy(3).dividedBy(6).minus(1).value().should.equal(1);
		});
		describe("this operation : 4 * 3 = 12", function () {
			var operation = math().take(4).multipliedBy(3);
			it("can return a value", function () {
				operation.value().should.equal(12);
			});
			it("can return an array of values", function () {
				// Operation: 4 * 3 = 12
				operation.values().should.eql([12]);
			});

		});
		describe("this operation: 4 * 3 + (3 / 2 + 4 * 2)", function () {
			var log = console.log;
			console.log = function() {};
			operation = math()
				.take(4)
				.log()
				.multipliedBy(3)
				.log("log")
				.plus(math()
						.take(3)
						.dividedBy(2)
						.plus(4)
						.multipliedBy(2)
						.value()
				);
			console.log = log;
			it("should equal 23 ", function () {
				operation.value()
						.should.equal(23);

			});
		});
	});

});
