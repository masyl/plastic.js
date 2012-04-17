(function (plastic) {

	function plasticModule() {
		var
				plastic = this,
				store = plastic.store = [];

		// Model will store the model object specified for each plastic instance


		var functions = {
			/**
			 * Create a new model instance and adds it to both the store and current data set
			 */
			create: function () {
				if (typeof plastic.Model === "function") {
					var construstor = functionnalConstructor(plastic.Model);
					// Cut out the context argument
					var args = Array.prototype.slice.call(arguments, 1);
					var item = construstor.apply(this, args);
					// Add the new instance to the store
					store.push(item);
					this.data([item]);
				}
			},
			/**
			 * Create multiple instances a set their values
			 */
			createAll: function (values) {
				var newItems = [];
				for (var i = 0; i < values.length; i = i + 1) {
					newItems.push(
							this
									.create()
									.value(values[i])
					);
				}
				this.data(newItems);
			},
			/**
			 * Return the value of the first item in the context
			 * @param context
			 */
			value_i18n: function (locale, newValues) {
				var item_i18n = {},
					item = this[0];
				// Set stuff
				if (typeof newValues === "object") {
					item = mergeObj(item,newValues)
				}

				// iterate each attribute on item
				for (var attr in item) {
					// Get the default value
					item_i18n[attr] = item[attr];
					// Try to get a localised value
					if (typeof item[attr + "_i18n"] === "object" ) {
						i18nValue = item[attr + "_i18n"][locale];
						if (typeof i18nValue !== "undefined") {
							item_i18n[attr] = i18nValue;
						}
					}
				}
				return item_i18n;
			},
			/**
			 * Return a array copy of the context
			 * @param context
			 */
			values_i18n: function (locale, newValues) {
				var i18nValues = this.slice(0);
				
				console.error("NOT DONE!");
				return i18nValues;
			},
			/**
			 * Return a new context with all the items in it
			 */
			all: function all() {
				this.data(store);
			}
		};

		/**
		 * Specify the constructor for creating new instance of the model
		 * @param context
		 * @param model
		 */
		this.model = function model(model) {
			if (model) plastic.Model = model;
			return this;
		};

		// Add the model functions
		this.use(functions);
	}

	//todo: change this merge function...
	function mergeObj(obj1,obj2){
		var obj3 = {};
	    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
	    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
	    return obj3;
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
	if (plastic) plastic.modules.math = plasticModule;
	if (module) module.exports = plasticModule;

})(this.plastic);

