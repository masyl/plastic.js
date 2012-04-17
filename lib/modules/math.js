/*

# plasticMath

A fluent api for for basic mathematical operators based on plastic.js

# Why?

Why use long function chains for simple math operations? But before
yelling *madness* consider the two scenarios for which the library has been
created.

First, it will be used to extend existing fluent apis with math functions. It makes sense to do
math with function if your already chaining methods. Ex.:
	var maxSizeInK = conf("maxSize").dividedBy(1024).round();

Second, we have a templating engine called "Dali" which will soon get a
rewrite. In its new version this templating engine will not allow the
embedding of javascript and only support the use of function calls instead of
full-fledge expressions.

But wait, There is a third scenario which is not yet implemented. While
operations on simple number like "3 + 5" is easy to do with standard operators,
operation of arrays and matrices are really complexe. So, eventually this api
will support operations on more complexe structures. For example:
	var matrix = [6, 6, 4, 4, 5, 6];
	math(matrix).mod(
		math(matrix).average()
	)

# Usage

Create an instance :
	var math = plasticMath();

For this operation :
	var result = (4 * 3) / 6 - 1;

Use a function chain like this:
	var result = math(4).multipliedBy(3).dividedBy(6).minus(1).val();


## Utility functions:
- .val(number) : Return the value of the first item in the context
- .take(number) : Use a new number for the current context

## Math functions:
- .minus(number) : Calculate the context minus this number
- .plus(number) : Calculate the context plus this number
- .dividedBy(number) : Calculate the context divided by this number
- .multipliedBy(number) : Calculate the context multiplied by this number

 */
(function (plastic) {

	function plasticModule() {

		var functions = {
			"minus": function (amount) {
				this.each(function (number) {
					return number - amount;
				});
			},
			"plus": function (amount) {
				this.each(function (number) {
					return number + amount;
				});
			},
			"multipliedBy": function (amount) {
				this.each(function (number) {
					return number * amount;
				});
			},
			"dividedBy": function (amount) {
				this.each(function (number) {
					return number / amount;
				});
			}
		};

		// Add the math functions
		this.use(functions);

	}

	// Export as either a global or a module
	if (plastic) plastic.modules.math = plasticModule;
	if (module) module.exports = plasticModule;

})(this.plastic);

