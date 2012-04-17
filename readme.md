# Plastic.js

Create fluent chainable APIs with ease

## Project status

This project is still under development. You should not use it for production purposes yet.

## Modules

Here are the current modules:

- core : the core module that comes with any instance
- model : Create and manipulate an model objects without the need for "object oriented" classes.
- math : Provide mathematical operators

## plastic.js core api

Let's say you wish to chain operations on colors, the most direct way would be
to create a new plastic object and ".use" a few methods like so:

	var colorizer = plastic({
		darker: function(colors) { ...some code here... },
		lighter: function(colors) { ...some code here... }
		red: function(colors) { ...some code here... }
	});

Once this is done, you can use the colorizer object and start chaining function
calls:

	var mainColor = "#6666FF"; // Light blue
	var shadow = colorizer().take(mainColor).darker(0.5).value(); // darker blue
	var lightGreen = colorizer()
		.take(mainColor)
		.lighter(0.5)
		.red(0.5)
		.value(); // light green

And you can also parse multiple colors at the same time:

	var redGradient = colorizer()
		.take("#333")
		.take("#666")
		.take("#999")
		.take("#CCC")
		.red(0.5)
		.values(); // Return an array of 4 red-ish colors

Those are only the most basic examples and only illustrate the basic Idea.

You can dig into the "model" and "math" module to see what else can be done.

Soon, I hope to have a more complete documentation.

## Features
- Creates chainable (fluent) api with very little boilerplate code
- Custom chainable function can handle single items or collections
- Very slim core module less than 2k compressed.
- You can create plastic object on the fly or package them as modules
- You can add functions to a "plastic object" using:
	- a name and a function
	- an object containing multiple function
	- a ad-hoc module in the form of a single function
	- a module name to by loaded dynamically
- Support for ".on()" event listeners on all chainable functions
- Handling of both a local context and a root context from more complex operations

## Tests

Even if the tests are not extensive yet, I try to keep the test coverage at 100%.
You can use "mocha" to run the tests. The "lib-cov" folder contains the instrumented
version of the code in order to obtain the html code-coverage report during tests.

### Commands to start unit tests
	rm -rf lib-cov
	node-jscoverage lib lib-cov
	mocha --reporter spec
	mocha --reporter html-cov test/math.js > coverage.html

#### One-liner
	rm -rf lib-cov;node-jscoverage lib lib-cov;mocha --reporter spec;mocha --reporter html-cov > coverage.html

With these commands, you will obtain a detailed test result and it will have create a "coverage.html" in the same folder.