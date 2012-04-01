/*
# plastic.js

## Members of the plastic object:
- .fn : The object containing all the chainable functions
- .modules : The object containing all the available modules (including "core")

## Members of the Chain object
- .context : The items to which the chainable function should apply (recursed by the loop handler)
- .rootContext : The root context. Usefull when keeping track of general model (all objects available, a dom, etc). This rootContext is available at every step of the chain.
- .next(context) : A function to create a new context to be returned by chainable function

## Members of the execution scope within chainable functions (this) :
- .loop(handler) : A loop handler to assist in processing each items of the context
- .args: The arguments received when the chainable function was called
- .chain: The chain object which contains the context
- .next(contextItems) : A shortcut to the chains ".next" function
- .context: A shortcut to the chains context
- .rootContext: A shortcut to the chains rootContext


## Chainable functions of the core module:
- .log(scopeItem) :
- .tap(handler) :
- .take(item) :
- .value() :
- .values() :


*/

(function () {
	// Add the current folder

	function plastic(functionsOrModule) {

		/**
		 * The core constructor for creating plastic objects.
		 * It is responsible for strating the function chaining
		 */
		// todo: support adding functions with the factory here ?
		function plasticFactory() {

			/**
			 * Create a new chain constructor for further prototyping
			 * This object will be user as the "this" scope in all function calls
			 * @param context
			 */
			// Try to externalize it from the Plastic() object
			function Chain (rootContext, contextInput) {
				var chain = this;
				// Create a new context array;
				this.context = [];
				// store the root context in the chain object
				this.rootContext = rootContext;
				this.next = function next(newContext) {
					return new Chain(chain.rootContext, newContext);
				};
				if (contextInput) {
					// Transfer all the contextInput into the new context
					for (var i = 0; i < contextInput.length; i = i + 1) {
						this.context.push(contextInput[i]);
					}
				}
			}

			Chain.prototype.emit = function(functionName, args, _prefix) {
				var
						listener,
						chain = this,
						prefix = (_prefix) ? _prefix + ":" : "";
				listener = plasticFactory.listeners[(prefix || "") + functionName];
				if (listener) {
					listener.apply(chain, args);
				}
			};


			// add functions to the chain constructor
			for (var functionName in plasticFactory.fn) {
				if (plasticFactory.fn.hasOwnProperty(functionName)) {
					Chain.prototype[functionName] = plasticFactory.fn[functionName];
				}
			}

			// Start a new chain with a fresh root context
			return new Chain([]);
		}

		// The object that contains all the functions to be added to the main chain' prototype
		plasticFactory.fn = {};

		/**
		 * A new functions to a Plastic object
		 * @param nameOrObj Function name or an object containing a literal object with multiple functions
		 * @param handler An optionnal handler (when the first argument is a function name)
		 */
		plasticFactory.use = function (nameOrObj, handler) {
			var obj = {};
			if (typeof(handler) === "function") {
				obj = {};
				obj[nameOrObj] = handler;
			} else {
				obj = nameOrObj;
			}
			for (var functionName in obj) {
				if (obj.hasOwnProperty(functionName)) {
					this.fn[functionName] = wrapper(functionName, obj[functionName]);
				}
			}
			return this;
		};

		plasticFactory.listeners = {};

		/**
		 * Add an event listener on any function call.
		 * The listener will be triggered once with the whole context
		 * as an argument
		 * @param functionName
		 * @param handler
		 * @param _prefix
		 */
		plasticFactory.on = function (functionName, handler, _prefix) {
			var prefix = (_prefix) ? _prefix + ":" : "";
			if (functionName && handler) {
				plasticFactory.listeners[prefix+functionName] = handler;
			}
		};

		/**
		 * Add an event listener on any function call.
		 * The listener will be triggered individually for each item
		 * of the context
		 * @param handlerName
		 * @param handler
		 */
		plasticFactory.onEach = function (handlerName, handler) {
			plasticFactory.on(handlerName, handler, "each");
		};

		/**
		 * Internal function wrapper used for all functions added to a plastic object
		 * via the "use" function
		 * @param handler
		 */
		function wrapper(handlerName, handler) {
			return function () {
				var chain = this;
				var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(chain.context);
				var _this = {
					loop: loop,
					next: chain.next,
					chain: chain,
					args: args,
					context: chain.context,
					rootContext: chain.rootContext
				};
				// Create a fresh loop handler
				function loop(handler) {
					var newContext = [],
						returnValue,
						contextItem,
						loopArgs = args.slice(1);
					for (var i = 0; i < chain.context.length; i = i + 1) {
						contextItem = chain.context[i];
						// Put the contextItem as the first argument
						loopArgs.unshift(contextItem);
						// Emit an event before the handler is called
						chain.emit.call(_this, handlerName, loopArgs, "each");
						// Call the handler
						returnValue = handler.apply(_this, loopArgs);
						// If the loop handler return undefined or true, the item is
						// added to the new context, otherwise it is not.
						if (typeof returnValue === "undefined" || returnValue === true) {
							newContext.push(contextItem);
						} else if (returnValue !== false) {
							newContext.push(returnValue);
						}
						// Otherwise, if false, dont add anything back in the context
						// Remove the contextItem from the first argument
						loopArgs.shift(contextItem);
					}
					var newChain = new chain.constructor(chain.rootContext, newContext);
					return newChain;
				}
				// Emit an event before the handler is called
				chain.emit.call(_this, handlerName, args);
				// Call the handler
				var newChainOrReturnValue = handler.apply(_this, args);
				args.pop();
				return newChainOrReturnValue;
			};
		}

		/**
		 * Load a plastic module from the standard modules or external modules
		 * @param moduleOrName
		 */
		plasticFactory.load = function load(moduleOrName) {
			var module;
			if (typeof moduleOrName === "function") {
				module = moduleOrName;
			} else {
				module = plastic.modules[moduleOrName];
			}
			if (module) {
				// call the module handler so it can configure this
				// plastic instance
				module.call(plasticFactory);
			}
		};

		// Load the plastic core
		plasticFactory.load("core");

		// Either load the specified additionnal module, or add specified
		// functions to the new Plastic constructor
		if (typeof functionsOrModule === "string") {
			plasticFactory.load(functionsOrModule);
		} else if (typeof functionsOrModule === "function") {
			// todo: should it really go throug load
			plasticFactory.load(functionsOrModule);
		} else if (typeof functionsOrModule === "object") {
			// If a collection of object is passed, its functions will be
			// added to the plastic instance
			plasticFactory.use(functions);
		}

		// Return the new Plastic constructor
		return plasticFactory();
	}

	// todo: do a better detection of node (require could be also on the client side)
	// Load modules with "require" if in node context
	if (require) {
		// todo: this should probably be an extend!
		plastic.modules = require("./modules");
	} else {
		plastic.modules = {};
	}

	// Add the plastic core module to the list of modules
	plastic.modules.core = core;

	/**
	 * The plastic.js core module, which is loaded with every instances
	 */
	function core() {
		// Add functions to the core module
		this.use({
			/**
			 * Return the value of the first item in the context
			 * @param context
			 */
			"value": function (context) {
				return this.context[0];
			},
			/**
			 * Return a array copy of the context
			 * @param context
			 */
			"values": function (context) {
				return this.context.slice(0);
			},
			/**
			 * Create a next context with an additionnal item in it
			 * @param context
			 * @param item
			 */
			"take": function (context, item) {
				var next = this.next(this.context);
				next.context.push(item);
				return next;
			},
			/**
			 * Core function for intercepting a chain and plating your the context
			 * Usefull for logging, debugging and ad-hoc operations.
			 * This function doest not create a new context
			 * @param handler
			 */
			"tap": function (context, handler) {
				handler(this);
				return this.chain;
			},
			/**
			 * Log the scope or member of the scope in which the function
			 * are executed. This lets you log things like .log("context")
			 * This function doest not create a new context
			 * @param logItem
			 */
			"log": function (context, logItem) {
				if (logItem) {
					console.log(this[logItem]);
				} else {
					console.log(this);
				}
				return this.chain;
			}
		});
	}

	// Export the plastic module
	if (module && module.exports) module.exports = plastic;
	this.plastic = plastic;

})();

