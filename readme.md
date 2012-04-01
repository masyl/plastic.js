# Plastic.js

Manipulate your data with a fluent API (Data à la jQuery)


## Introduction

Not yet...

## Project status

This project is still under development. You should not use it for production purposes yet.

## Modules

Here are the current modules:
- core : the core module that comes with any instance
- model : Create and manipulate an model objects without the need for "object oriented" classes.
- math : Provide mathematical operators

## Tests

Even if the tests are not extensive yet, I try to keep the test coverage at 100%.
You can use vows to run the tests. The "lib-cov" folder contains the instrumented
version of the code in order to obtain the html code-coverage report during tests.

### Commands to start unit tests
	rm -rf lib-cov
	node-jscoverage lib lib-cov
	vows --spec --cover-html

With these commands, vows will have create a "coverage.html" in the same folder.