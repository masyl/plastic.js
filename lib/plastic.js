module.exports = function (Model, methods) {
	function Plastic() {

		/**
		 * Create a new chain constructor for further prototyping
		 * @param context
		 */
		function Chain (rootContext, contextInput) {
			// Create a new context array;
			this.context = [];
			this.rootContext = rootContext;
			if (contextInput) {
				// Transfer all the contextInput into the new context
				for (var i = 0; i < contextInput.length; i = i + 1) {
					this.context.push(contextInput[i]);
				}
			}
		}

		// add methods to the chain constructor
		for (var method in Plastic.fn) {
			if (Plastic.fn.hasOwnProperty(method)) {
				Chain.prototype[method] = Plastic.fn[method];
			}
		}

		// Start a new chain with a fresh root context
		return new Chain([]);
	}

	// The object that contains all the methods to be added to the main chain' prototype
	Plastic.fn = {};

	/**
	 * Create a new model instance and adds it to both the root context and current context
	 */
	Plastic.fn.create = function () {
		var construstor = functionnalConstructor(Model);
		var model = construstor.apply(this, arguments);
		this.rootContext.push(model);
		return new this.constructor(this.rootContext, [model]);
	};

	/**
	 * Create a new model instance, add it to the root context and use it as the current context
	 */
	Plastic.fn.tap = function (handler) {
		handler(this);
		return this;
	};

	/**
	 * Return a new context with all the items in it
	 */
	Plastic.fn.all = function () {
		var newContext = [];
		for (var i = 0; i < this.rootContext.length; i = i + 1) {
			newContext.push(this.rootContext[i]);
		}
		return new this.constructor(this.rootContext, newContext);
	};


	Plastic.use = function (nameOrObj, handler) {
		var obj = {};
		if (typeof(handler) === "function") {
			obj = {};
			obj[nameOrObj] = handler;
		} else {
			obj = nameOrObj;
		}
		for (var method in obj) {
			if (obj.hasOwnProperty(method)) {
				this.fn[method] = wrapper(obj[method]);
			}
		}
		return this;
	};

	function wrapper(handler) {
		return function () {
			var chain = this;
			// Create a fresh loop handler
			function loop(handler) {
				for (var i = 0; i < chain.context.length; i = i + 1) {
					handler.apply(chain, [chain.context[i]]);
				}
			}
			var args = Array.prototype.slice.call(arguments, 0);
			args.push(loop);
			args.push(chain.context);
			handler.apply(chain, args);
			args.pop();
			args.pop();
			return chain;
		};
	}

	// Add methods to the new Plastic constructor
	if (methods) Plastic.use(methods);

	// Return the new Plastic constructor
	return Plastic;
};

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

