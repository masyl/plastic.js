(function () {

	function plastic(functions) {

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
		 * Core function for intercepting a chain and plating your the context
		 * Usefull for logging, debugging and ad-hoc operations
		 * @param handler
		 */
		// todo: add this function through the "use" function
		plasticFactory.fn.tap = function (handler) {
			handler(this);
			return this;
		};


		// Add functions to the new Plastic constructor
		if (functions) plasticFactory.use(functions);

		// Return the new Plastic constructor
		// todo: support multiple instances without the "require" mechanism
		return plasticFactory;
	}

	if (module && module.exports) module.exports = plastic;
	this.plastic = plastic;


})();

