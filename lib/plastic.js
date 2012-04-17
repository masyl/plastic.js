/*
# plastic.js

The plastic module is a factory that returns a new plastic instance

## Members of the plastic class/function object:

- .use : Add functionnalities to plastic (function or modules)
- .fn : The object containing all the chainable functions
- .modules : The object containing all the available modules (including "core")
- .listeners :
- .on :
- .onEach :

## Members of the Chain object

Note: The chain object is an array with additionnal attributes and methods

- .emit() :
- .async :
- .asyncStarted : Boolean to know if an async chain is in progress
- .asyncDone() :
- .asyncStep() :
- .Chain
- .Plastic

## Chainable functions of the core module:

- .each(callback) :
- .log(scopeItem) :
- .tap(callback) :
- .take(item) :
- .value() :
- .values() :
- .complete(callback) : Set a single callback to be called when all async calls are complete

*/
//X todo: chain function call returns Chain class ?
//X todo: augment chain with methods
//X todo: keep the same chain instance through each chained calls (getting rid of .next() )
//X todo: get rid of the (context, ...) as the first param on all plastic functions
//X todo: get rid of rootContext
//X todo: replace the .loop with a simple .each ? can it work ?
//X todo: function or attribute for acces to the main Class	(.Plastic)
//X todo: a way to start a new chain within a callback or handler? (.Chain)

(function () {

	//Todo: 3 wrappers is too much : plastic() -> plasticFactory() -> Chain() ???
	function plastic(functionsOrModule) {

		/**
		 * The core constructor for creating plastic objects.
		 * It is responsible for strating the function chaining
		 */
		// todo: the factory should take some query syntax as argument
		function Plastic() {
			/**
			 * Create a new chain
			 * This object will also be used as the "this" scope in all function calls
			 * @param [data]
			 */
			function Chain(data) {
				var chain = [];

				// Expose the Chain factory
				chain.Chain = Chain;
				// Expose the Plastic factory
				chain.Plastic = Plastic;
				// Initialize async status
				chain.async = [];
				chain.asyncStarted = false;
				chain.asyncDone = null; // default empty handler

				/**
				 * Process the next handler in the asyncStack
				 */
				chain.asyncStep = function () {
					if (chain.async.length > 0) {
						var handler = chain.async.shift();
						handler(function (err, newContext) {
							if (err) {
								// flush the async call stack
								chain.async.length = 0;
								chain.asyncStarted = false;
								if (chain.asyncDone) chain.asyncDone(err);
							} else {
                                // If a new set of data has been sent to the callback, use it as the new data set
                                if (chain !== newContext) chain.data(newContext);
								process.nextTick(function () {
									chain.asyncStep();
								});
							}
							if (chain.async.length === 0) {
								chain.asyncStarted = false;
								if (chain.asyncDone) chain.asyncDone(null, chain);
							} else {
								process.nextTick(function() {
									chain.asyncStep();
								});
							}
						});
					}
					return chain;
				};

				chain.data = function data(data) {
					chain.length = 0;
					if (typeof data === "object") {
						if (data.constructor.name === "Array") {
							// Transfer all the data into the chain
							for (var i = 0; i < data.length; i = i + 1) {
								chain.push(data[i]);
							}
						}
					}
					return chain;
				};

				chain.emit = function(functionName, args, _prefix) {
					var
							listener,
							prefix = (_prefix) ? _prefix + ":" : "";
					listener = Plastic.listeners[(prefix || "") + functionName];
					if (listener) {
						listener.apply(chain, args);
					}
					return chain;
				};

				// Extend the chain will all the plastic functions
				extend(chain, Plastic.fn);
				// Set the current data set
				chain.data(data);

				return chain;
			}


			// Start a new chain with a fresh root context
			return Chain();
		}

		// The object that contains all the functions to be added to the main chain' prototype
		Plastic.fn = {};
		
		/**
		 * A new functions to a Plastic object
		 *
		 * Method Overloads:
		 * String : Load a module by name
		 * Array: Load a series of modules by name
		 * Function: Load a module (modules are function handlers)
		 * Object : Add multiple handlers. Each object member is a single handler.
		 * String, Function: Add a single handler
		 */
		Plastic.use = function () {
			var
					args = arguments,
					async = args[1] || false,
					constructor, // name of the constructor of the the first argument
					obj,
					modules; // A module (as a function or a string)

			constructor = args[0].constructor.name;
			if (constructor === "Array") {
				modules = args[0];
			} else if (constructor === "String") {
				if (args.length === 2) {
					constructor = args[1].constructor.name;
					if (constructor === "Function") {
						// Create an object with a single method
						obj = {};
						obj[args[0]] = args[1];
						async = args[2] || false;
					}
				} else {
					modules = [args[0]];
				}
			} else if (constructor === "Function") {
				modules = [args[0]];
			} else if (constructor === "Object") {
				obj = args[0]
			}

			// todo: separate each cases in separate functions and then use these functions in previous if/else
			var i;
			if (obj) {
				for (i in obj) {
					if (obj.hasOwnProperty(i)) {
						this.fn[i] = wrapper(i, obj[i], async);
					}
				}
			} else if (modules) {
				// Load a series of modules
				for (i = 0; i < modules.length; i = i + 1) {
					loadModule(modules[i]);
				}
			}
			return this;
		};


		// todo: do a better detection of node (require could be also on the client side)
		// Load modules with "require" if in node context
		Plastic.modules = {};
		if (require) {
			Plastic.modules = require("./modules");
		}
		// Add the plastic core module to the list of modules
		Plastic.modules.core = core;

		Plastic.listeners = {};

		/**
		 * Add an event listener on any function call.
		 * The listener will be triggered once with the whole context
		 * as an argument
		 * @param functionName
		 * @param handler
		 * @param _prefix
		 */
		Plastic.on = function (functionName, handler, _prefix) {
			var prefix = (_prefix) ? _prefix + ":" : "";
			if (functionName && handler) {
				Plastic.listeners[prefix+functionName] = handler;
			}
		};

		/**
		 * Add an event listener on any function call.
		 * The listener will be triggered individually for each item
		 * of the context
		 * @param handlerName
		 * @param handler
		 */
		Plastic.onEach = function (handlerName, handler) {
			Plastic.on(handlerName, handler, "each");
		};

		/**
		 * Internal function wrapper used for all functions added to a plastic object
		 * via the "use" function
		 * @param handler
		 */
		function wrapper(handlerName, handler, isAsync) {
			return function () {
				var
						chain = this,
						newChainOrReturnValue,
						args = Array.prototype.slice.call(arguments, 0); // Get a real array from arguments

				// Emit an event before the handler is called
				chain.emit(handlerName, args);

				// Call the handler
				if (isAsync) {
					// Add a new handler onto the asyncStack
					chain.async.push(function(callback) {
						args.push(callback); // Add the callback to the list of arguments
						newChainOrReturnValue = handler.apply(chain, args);
						if (newChainOrReturnValue === void 0) newChainOrReturnValue = chain;
						return newChainOrReturnValue;
					});
					// Start the async chain on the next tick if its not already started
					if (!chain.asyncStarted) {
						chain.asyncStarted = true;
						process.nextTick(function() {
							chain.asyncStep()
						});
					}
					newChainOrReturnValue = chain; // Return the same unchanged chain
				} else {
					newChainOrReturnValue = handler.apply(chain, args);
					if (newChainOrReturnValue === void 0) newChainOrReturnValue = chain;
				}
				return newChainOrReturnValue;
			};
		}

		/**
		 * Load a plastic module from the standard modules or external modules
		 * @param moduleOrName
		 */
		function loadModule(moduleOrName) {
			var module;
			if (typeof moduleOrName === "function") {
				module = moduleOrName;
			} else {
				module = Plastic.modules[moduleOrName];
			}
			if (module) {
				// call the module handler with the factory as its context
				module.call(Plastic);
			}
		}

		// Load the plastic core
		Plastic.use("core");

		if (functionsOrModule) Plastic.use(functionsOrModule);

		// Return the new Plastic constructor
		return Plastic;
	}


	/**
	 * The plastic.js core module, which is loaded with every instances
	 */
	function core() {
		// Add functions to the core module
		this.use({
			/**
			 * Return the value of the first item in the context
			 */
			value: function (newValue) {
				var
						attr,
						item = this[0];
				if (item !== void 0) {
					if (typeof newValue === "object") {
						for (attr in newValue) {
							if (newValue.hasOwnProperty(attr)) {
								item[attr] = newValue[attr];
							}
						}
					}
				}
				return item;
			},
			each: function (callback) {
				var value,
					data = [];
				if (typeof callback === "function") {
					for (var i = 0; i < this.length; i = i + 1) {
						value = callback.call(this, this[i]);
						if (value !== void 0) {
							data.push(value);
						}
					}
					// If the iterator returned values, use them as the new dataset
					if (data.length) this.data(data);
				}
			},
			/**
			 * Return a array copy of the context
			 */
			values: function () {
				return this.slice(0);
			},
			/**
			 * Create a next context with an additionnal item in it
			 * @param item
			 */
			take: function (item) {
				this.push(item);
			},
			/**
			 * Core function for intercepting a chain and plating your the context
			 * Usefull for logging, debugging and ad-hoc operations.
			 * This function doest not create a new context
			 * @param handler
			 */
			tap: function (handler) {
				handler(this);
			},
			/**
			 * Log the scope or member of the scope in which the function
			 * are executed. This lets you log things like .log("context")
			 * This function doest not create a new context
			 * @param logItem
			 */
			log: function (logItem) {
					console.log(logItem ? this[logItem] : this);
			},
			/**
			 * Called when all asynch chain calls are completed!
			 * @param callback
			 */
			complete: function (callback) {
				this.asyncDone = callback;
			}
		});
	}

	// Export the plastic module
	if (module && module.exports) module.exports = plastic;
	this.plastic = plastic;

	// Small utility to extend an object
	function extend(target, source) {
		for (var attr in source) {
			if (source.hasOwnProperty(attr)) {
				target[attr] = source[attr];
			}
		}
	}


})();

