(function (plastic) {

	function plasticModelFactory(Model, methods) {
		var plasticModel = plastic(methods || {});

		// Add the modeling methods, overriding any user-defined methods
		plasticModel.use({
			/**
			 * Create a new model instance and adds it to both the root context and current context
			 */
			create: function () {
				var construstor = functionnalConstructor(Model);
				// Cut out the context argument
				var args = Array.prototype.slice.call(arguments, 1);
				var model = construstor.apply(this, args);
				// Add the new instance to the rootContext
				this.rootContext.push(model);
				// And also pass it as the next context
				return this.next([model]);
			},
			/**
			 * Return a new context with all the items in it
			 */
			all: function all() {
				return this.next(this.rootContext);
			}
		});

		return plasticModel;
	}


	/**
	 * Transform a constructor so that it can be call like a normal function
	 * without changing its original behavior
	 * (without the "new" instruction)
	 * @param Constructor
	 */
	function functionnalConstructor(Constructor) {
		return function() {
			var args = Array.prototype.slice.call(arguments, 0),
				Temp = function () {}, // temporary constructor
				inst,
				ret;
			// Give the Temp constructor the Constructor's prototype
			Temp.prototype = Constructor.prototype;
			// Create a new instance
			inst = new Temp;
			// Call the original Constructor with the temp instance as its context (i.e. its 'this' value)
			ret = Constructor.apply(inst, args);
			// If an object has been returned then return it otherwise return the original instance.
			// (consistent with behaviour of the new operator)
			return Object(ret) === ret ? ret : inst;
		}
	}


	// Export as either a global or a module
	if (module) module.exports = plasticModelFactory;
	this.plasticModel = plasticModelFactory;

})(require && require("./plastic") || this.plastic);

