if (typeof manualSyncer === 'undefined') {
	// Singleton
	manualSyncer = function () {

		// CREATE

		/// Download files that don't exist locally
        /// Condition: Local file does not exist AND remote file has a newer modified date than local's LastSync property setting.
		var getCreateLocalTasks = function () {
			
		};
		/// Upload files that don't exist remotely
        /// Condition: Remote file does not exist AND local file has a newer modified date than remote's LastSync property setting.
		var getCreateRemoteTasks = function () {
			
		};

		// UPDATE

		/// Download new remote files to replace old local files
		/// Condition: Local and remote files exist with the same name AND remote file's modified date is newer than local's.
		var getUpdateLocalTasks = function () {
			
		};

		/// Upload new local files to replace old remote files.
		/// Condition: Local and remote files exist with the same name AND local file's modified date is newer than remote's.
		var getUpdateRemoteTasks = function () {
			
		};

		// DELETE

		/// Delete local file when remote file ceased to exist.
        /// Condition: Remote file does not exist AND local file's modified date is older than remote's LastSync AND local file's
        ///			   modified date is older than local's LastSync.
		var getDeleteLocalTasks = function () {
			
		};

		// Delete remote file when local file ceased to exist.
        // Condition: Local file does not exist AND remote file's modified date is older than local's LastSync.
		var getDeleteRemoteTasks = function () {
			
		};


		var getCrudTasks = function(localFiles, remoteFiles) {
			var tasks = [];
			tasks.push(getCreateLocalTasks());
			tasks.push(getCreateRemoteTasks());
			tasks.push(getUpdateLocalTasks());
			tasks.push(getUpdateRemoteTasks());
			tasks.push(getDeleteLocalTasks());
			tasks.push(getDeleteRemoteTasks());
			return tasks;
		};

		/*
		callback = function(err, syncTasks);
		syncTasks is an syncTask Array
		*/
		this.getTasks = function (callback) {
			request = require('request');
			// first, get a list of cloudFiles from the server
			request(apiHelper.routes.tree, function (err, response, body) {
				if (!error && response.statusCode == 200) {
					var remoteFiles = response;
			    	// Now get a list of localFiles
			    	fileHelper.getLocalFiles(function (err, localFiles) {
			    		if (err) {
			    			callback(err);
			    		}
			    		else {
				    		// Get their tasks
				    		var syncTasks = getCrudTasks(localFiles, remoteFiles);
			    			callback(err, syncTasks);
			    		}
			    	});
			  	} else {
			  		callback(err, []);
			  	}
			});
		};
	};