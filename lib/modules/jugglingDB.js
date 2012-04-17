(function (plastic) {

	function plasticModule() {
		var plastic = this;
		// Model will store the model object specified for each plastic instance
		var plasticFunctions = {
			all: function (callback) {
				if (typeof plastic.Model === "function") {
					// Fetch everything from the db and ... cue callbacks ? wtf ?
					plastic.Model.all(function (err, data) {
						callback(err, data);
					});
				}
			},
			/**
			 * Create a new model instance and adds it to both the root context and current context
			 */
			create: function (data, callback) {
				if (typeof plastic.Model === "function") {
					// Cut out the context argument
					plastic.Model.create(data, function(err, data) {
						callback(err, [data])
					});
				} else {
					callback(null, this);
				}
			},
			createAll: function (dataArray, callback) {
				var
						i,
						results = [],
						errorOccured = false;
				if (typeof plastic.Model === "function") {
					// Cut out the context argument
					for (i = 0; i < dataArray.length; i = i + 1) {
						plastic.Model.create(dataArray[i], onCreate);
					}
				} else {
					callback(null, this);
				}

				function onCreate (err, data) {
					if (!errorOccured) {
						if (err) {
							errorOccured = false;
							callback(err, results);
						} else {
							results.push(data);
							if (results.length >= dataArray.length) {
								callback(null, results)
							} // Else keep waiting for more callbacks
						}
					}
				}
			},
			destroy: function (callback) {
				// Fetch everything from the db and ... cue callbacks ? wtf ?
				this.each(function (record) {
					record.destroy(function (err, data) {
						console.log("TODO: Destroy should be parallel async!");
					});
				});
				// todo: call this callback after all destroy worked in parrallel
				callback(null, []);
			}
		};

		// Add the model functions as async function
		this.use(plasticFunctions, true);
	}

	// Export as either a global or a module
	if (plastic) plastic.modules.math = plasticModule;
	if (module) module.exports = plasticModule;

})(this.plastic);

