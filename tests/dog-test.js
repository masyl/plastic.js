var plasticModel = require("../lib/plasticModel");

// A Dog constructor
function Dog(name) {
	this.name = name;
	this.distance = 0;
	this.jumps = [];
}

// Create a chainable model with the Dog model
var Dogs = plasticModel(Dog, {
	bark: function(dogs) {
		return this.loop(function (dog) {
			console.log(dog.name + " goes 'BARK!'");
		});
	},
	walk: function(dogs, howFar) {
		return this.loop(function(dog) {
			console.log(dog.name + " walked " + howFar + " meters away!");
			dog.distance = dog.distance + howFar;
		});
	}
});

// Add a single jump method that receives all dogs that are in the context
// Requires you to handle the forEach
Dogs.use("jump", function(dogs, howHigh) {
	return this.loop(function (dog) {
		dog.jumps.push(howHigh);
		console.log(dog.name + " jumps " + howHigh + " feet high!");
	})
});

// Add multiple methods
Dogs.use({
	sleep: function(dogs, howLong) {
		return this.loop(function(dog) {
			console.log(dog.name + " is sleeping for " + howLong + " hours!");
		});
	},
	"stay": function(dogs) {
		return this.loop(function(dog) {
			console.log(dog.name + " is doing nothing!");
		});
	},
	"die": function(dogs) {
		return this.loop(function(dog) {
			console.log(dog.name + " is dead!");
		});
	}
});

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
			console.log("threeSleepingDogs: ", dogs);
		});

// Only ricky should die
var deadRicky = dogs
		.create("Ricky")
		.die()
		.tap(function (dogs) {
				console.log("deadRicky: ", dogs);
			});
