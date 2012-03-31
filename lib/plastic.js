(function () {

	function plastic(methods) {

		/**
		 * The core constructor for creating plastic objects.
		 * It is responsible for strating the function chaining
		 */
		// todo: support adding methods here ?
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

				// add methods to the chain constructor
				for (var method in plasticFactory.fn) {
					if (plasticFactory.fn.hasOwnProperty(method)) {
						Chain.prototype[method] = plasticFactory.fn[method];
					}
				}

			// Start a new chain with a fresh root context
			return new Chain([]);
		}

		// The object that contains all the methods to be added to the main chain' prototype
		plasticFactory.fn = {};

		/**
		 * A new methods to a Plastic object
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
			for (var method in obj) {
				if (obj.hasOwnProperty(method)) {
					this.fn[method] = wrapper(obj[method]);
				}
			}
			return this;
		};

		/**
		 * Internal function wrapper used for all methods added to a plastic object
		 * via the "use" function
		 * @param handler
		 */
		function wrapper(handler) {
			return function () {
				var chain = this;
				// Create a fresh loop handler
				function loop(handler) {
					var newContext = [];
					var returnValue;
					var contextItem;
					for (var i = 0; i < chain.context.length; i = i + 1) {
						contextItem = chain.context[i];
						returnValue = handler.apply(chain, [contextItem]);
						if (typeof returnValue === "undefined" || returnValue === true) {
							newContext.push(contextItem);
						} else if (returnValue === false) {
							newContext.push(returnValue);
						}
					}
					var newChain = new chain.constructor(chain.rootContext, newContext);
					return newChain;
				}
				var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(chain.context);
				var _this = {
					loop: loop,
					next: chain.next,
					context: chain.context,
					rootContext: chain.rootContext
				};
				var newChainOrReturnValue = handler.apply(_this, args);
				args.pop();
				return newChainOrReturnValue;
			};
		}

		/**
		 * Core method for intercepting a chain and plating your the context
		 * Usefull for logging, debugging and ad-hoc operations
		 * @param handler
		 */
		// todo: add this method through the "use" function
		plasticFactory.fn.tap = function (handler) {
			handler(this);
			return this;
		};


		// Add methods to the new Plastic constructor
		if (methods) plasticFactory.use(methods);

		// Return the new Plastic constructor
		// todo: support multiple instances without the "require" mechanism
		return plasticFactory;
	}

	if (module && module.exports) {
		module.exports = plastic;
	} else {
		this.plastic = plastic;
	}


})();

