var
		plastic = require("../lib-cov/plastic");

// A Dog constructor to be used as a model
function Dog(name) {
	this.name = name;
	this.distance = 0;
	this.jumps = [];
	this.dead = false;
}

describe('With the plastic model module', function () {
	describe("a new plastic cube", function () {
		var cubes = plastic({
			test: function(cubes) {
			}
		});
		it("can be logged", function () {
			var log = console.log;
			console.log = function() {};
			cubes().log();
			console.log = log;
		});
	});
	describe("a complexe plastic dog model", function () {
		var plasticDogs = plastic(function () {
			this.use("model");
			this.use({
				bark: function() {
					this.each(function (dog) {
						//console.log(dog.name + " goes 'BARK!'");
					});
				},
				walk: function(howFar) {
					this.each(function(dog) {
						//console.log(dog.name + " walked " + howFar + " meters away!");
						dog.distance = dog.distance + howFar;
						// It's not needed to return the dog, but it tests wether
						// you can return any object back into the context in
						// replacement
					});
				}
			});

			// Add a single jump method that receives all dogs that are in the context
			// Requires you to handle the forEach
			this.use("jump", function(howHigh) {
				this.each(function (dog) {
					dog.jumps.push(howHigh);
					//console.log(dog.name + " jumps " + howHigh + " feet high!");
				})
			});

			// Add multiple methods
			this.use({
				sleep: function(howLong) {
					this.each(function(dog) {
						//console.log(dog.name + " is sleeping for " + howLong + " hours!");
					});
				},
				noDeadDogs: function() {
					this.each(function(dog) {
						if (!dog.dead) return dog;
						//todo: what if there are no dogs to return
						// this would be interpreted as an unchanged scope
					});
				},
				stay: function() {
					this.each(function(dog) {
						//console.log(dog.name + " is doing nothing!");
					});
				},
				die: function() {
					this.each(function(dog) {
						dog.dead = true;
						//console.log(dog.name + " is dead!");
					});
				}
			});

			this.on("walk", function (howFar) {
				//console.log("Bob is walking along " + dogs.length + " dogs for " + howFar + " meters!");
			});

			this.on("jump", function (howFar) {
				//console.log("Bob is jumping along " + dogs.length + " dogs for " + howFar + " meters!");
			});

			this.onEach("walk", function (howFar) {
				//console.log("Bob is walks along " + dog.name + " for " + howFar + " meters!");
			});
		});
		// First try to create an item without specifying a model
		// It should do nothing
		plasticDogs().create("test");

		// Create a plasic module on the fly, that will be used as the Dog model
		plasticDogs.model(Dog);

		it("should be a function", function () {
			(typeof plasticDogs).should.equal("function");
		});
		it('can be used to manipulate objects', function () {
			var threeSleepingDogs = plasticDogs()
				.create("Fido") // Create a dog by calling the original constructor with these parameters
				.create("Ricky")
				.create("Sparky")
				.all()
				.tap(function (dogs) {
					dogs.length.should.equal(3);
					//console.log("dogs: ", dogs);
				})
				.create("Princess")
				.create("Bobby")
				.tap(function (dogs) {
					//console.log("dogs: ", dogs);
				})
				.all() // Select all available dogs
				.walk(15)
				.tap(function (dogs) {
					//console.log("dogs: ", dogs);
				})
				.jump(3)
				.sleep(6)
				.tap(function (dogs) {
					//console.log("threeSleepingDogs: ", dogs);
				});

			threeSleepingDogs.all().length.should.equal(5);

			// Only ricky should die
			var dyingRicky = threeSleepingDogs.create("Ricky");

			//todo: add "on" and "onEach" event listening on the chain instance
			/*
			dyingRicky.onEach("die", function(dog) {
				//console.log("Bob's dog " + dog.name + " is dead!!! So sad!");
			});
			*/
			dyingRicky.die();

			var livingDogs = threeSleepingDogs.all().noDeadDogs();
			livingDogs.length.should.equal(5);
			// Only five dogs in the context
		});
	});
});
