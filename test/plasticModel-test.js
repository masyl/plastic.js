var
		plastic = require("../lib/plastic"),
//		plasticModel = require("../lib-cov/plastic"),
    	assert = require('assert');

// A Dog constructor to be used as a model
function Dog(name) {
	this.name = name;
	this.distance = 0;
	this.jumps = [];
	this.dead = false;
}

exports.testDogs = function(beforeExit, assert) {

	function Dogs() {

		var plasticDog = plastic(function () {
			this.load("model");
			this.use({
				bark: function(dogs) {
					return this.loop(function (dog) {
						//console.log(dog.name + " goes 'BARK!'");
					});
				},
				walk: function(dogs, howFar) {
					return this.loop(function(dog) {
						//console.log(dog.name + " walked " + howFar + " meters away!");
						dog.distance = dog.distance + howFar;
						// It's not needed to return the dog, but it tests wether
						// you can return any object back into the context in
						// replacement
						return dog;
					});
				}
			});

			// Add a single jump method that receives all dogs that are in the context
			// Requires you to handle the forEach
			this.use("jump", function(dogs, howHigh) {
				return this.loop(function (dog) {
					dog.jumps.push(howHigh);
					//console.log(dog.name + " jumps " + howHigh + " feet high!");
				})
			});

			// Add multiple methods
			this.use({
				sleep: function(dogs, howLong) {
					return this.loop(function(dog) {
						//console.log(dog.name + " is sleeping for " + howLong + " hours!");
					});
				},
				noDeadDogs: function(dogs) {
					return this.loop(function(dog) {
						if (dog.dead) return false;
					});
				},
				stay: function(dogs) {
					return this.loop(function(dog) {
						//console.log(dog.name + " is doing nothing!");
					});
				},
				die: function(dogs) {
					return this.loop(function(dog) {
						dog.dead = true;
						//console.log(dog.name + " is dead!");
					});
				}
			});

			this.on("walk", function (dogs, howFar) {
				//console.log("Bob is walking along " + dogs.length + " dogs for " + howFar + " meters!");
			});

			this.on("jump", function (dogs, howFar) {
				//console.log("Bob is jumping along " + dogs.length + " dogs for " + howFar + " meters!");
			});

			this.onEach("walk", function (dog, howFar) {
				//console.log("Bob is walks along " + dog.name + " for " + howFar + " meters!");
			});
		});
		// Create a plasic module on the fly, that will be used as the Dog model
		plasticDog.model(Dog);
		return plasticDog;
	}

//			.model(Dog)

	var dogs = Dogs(); // Create a new empty collection of dogs

	var threeSleepingDogs = dogs
		.create("Fido") // Create a dog by calling the original constructor with these parameters
		.create("Ricky")
		.create("Sparky")
		.tap(function (dogs) {
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

	// Only ricky should die
	var dyingRicky = dogs.create("Ricky");

	//todo: add "on" and "onEach" event listening on the chain instance
	/*
	dyingRicky.onEach("die", function(dog) {
		//console.log("Bob's dog " + dog.name + " is dead!!! So sad!");
	});
	*/
	dyingRicky.die();

	var allLivingDogs = dogs.all().noDeadDogs();
	// Only five dogs in the context
	assert.equal(allLivingDogs.context.length, 5);

};
