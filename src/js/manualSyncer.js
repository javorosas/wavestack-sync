if (typeof manualSyncer === 'undefined') {
	// Singleton
	manualSyncer = function () {
		if (!localStorage.lastSync) {
			localStorage.lastSync = "1990-01-01";
		}

		// FILTERS
		/// Condition: Local file does not exist AND remote file has a newer modified date than local's LastSync property setting.
		var conditionToCreateLocal = function(localFiles) {
			return function (remoteFile) {
				var remoteHasNewerDateThanLocalSync = (new Date(remoteFile.ModifiedDate)).getTime() > (new Date(localStorage.lastSync)).getTime();
				var localFileNotExists localFiles.some(function (localFile, i) {
					return (localFile.RelativePath === remoteFile.RelativePath);
				});
				return localFileNotExists && remoteHasNewerDateThanLocalSync;
			};
		};

		var conditionToCreateRemote = function (remoteFiles) {
			return function (localFile) {

			};
		}

		// CREATE

		/// Download files that don't exist locally
		var getCreateLocalTasks = function (localFiles, remoteFiles) {
			var localLastSync = new Date(localStorage.lastSync);
			var filesToCreate = remoteFiles.filter(conditionToCreateLocal(localFiles));
			var tasks = [];
			filesToCreate.forEach(function (file) {
				tasks.push(new DownloadTask(file.RelativePath));
			});
		};
		/// Upload files that don't exist remotely
        /// Condition: Remote file does not exist AND local file has a newer modified date than remote's LastSync property setting.
		var getCreateRemoteTasks = function (localFiles, remoteFiles) {
			
		};

		// UPDATE

		/// Download new remote files to replace old local files
		/// Condition: Local and remote files exist with the same name AND remote file's modified date is newer than local's.
		var getUpdateLocalTasks = function (localFiles, remoteFiles) {
			
		};

		/// Upload new local files to replace old remote files.
		/// Condition: Local and remote files exist with the same name AND local file's modified date is newer than remote's.
		var getUpdateRemoteTasks = function (localFiles, remoteFiles) {
			
		};

		// DELETE

		/// Delete local file when remote file ceased to exist.
        /// Condition: Remote file does not exist AND local file's modified date is older than remote's LastSync AND local file's
        ///			   modified date is older than local's LastSync.
		var getDeleteLocalTasks = function (localFiles, remoteFiles) {
			
		};

		// Delete remote file when local file ceased to exist.
        // Condition: Local file does not exist AND remote file's modified date is older than local's LastSync.
		var getDeleteRemoteTasks = function (localFiles, remoteFiles) {
			
		};


		var getCrudTasks = function(localFiles, remoteFiles) {
			var tasks = [];
			tasks.push(getCreateLocalTasks(localFiles, remoteFiles));
			tasks.push(getCreateRemoteTasks(localFiles, remoteFiles));
			tasks.push(getUpdateLocalTasks(localFiles, remoteFiles));
			tasks.push(getUpdateRemoteTasks(localFiles, remoteFiles));
			tasks.push(getDeleteLocalTasks(localFiles, remoteFiles));
			tasks.push(getDeleteRemoteTasks(localFiles, remoteFiles));
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