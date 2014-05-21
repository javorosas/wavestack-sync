if (typeof DownloadTask === 'undefined') {
	DownloadTask = function (path) {
		this.path = path;
	};

	DownloadTask.prototype.action = {
		past: 'Downloaded',
		present: 'Downloading'
	};

	/*
	WARNING: This method should NOT be by an instance of DowloadTask. To perform the download please use the 'run' method.
			 This method is not private because I wanted to keep the prototype pattern. Maybe in a future refactor it will be private or
			 moved to another helper.
	options parameter:
		url: url of the file to get
		dest: local path to save the file
		onComplete: the file finished download and save
		onNetworkError: Request failed
		onFileError: Maybe the file is in use
	*/
	DownloadTask.prototype.download = function(options) {
		var fs = require('fs-extra');
		var pathModule = require('path');
		// Get the directory path to the destination file
		var directory = options.dest;
		var fileName = directory + "/" + pathModule.basename(this.path);
		// Create the directory path before downloading the file
		fs.mkdirs(directory, function (error) {
			if (!error) {
				// Send request to the server to GET the file
				request.get({ url: options.url, json: true, callback: function (error, response, body) {
					if (error || response.statusCode != 200) {
						console.log(error);
						console.log(response.statusCode);
						options.onNetworkError(error);
					}
				}}).pipe(
					// Write downloaded data to the new file
					fs.createWriteStream(fileName).on('error', function (error) {
						options.onFileError(error);
					}).on('close', function () {
						// Once downloaded, update the file stamps with info from the server
						request.get({ url: apiHelper.routes.info + '?path=' + encodeURIComponent(this.path), json: true, callback: function (error, response, body) {
							var remoteInfo = response;
							// Set modified time to the new file
							fs.utimes(fileName, new Date(remoteInfo.ModifiedUtc), new Date(remoteInfo.ModifiedDate));
							options.onComplete();
						}});
					})
				);
			}
		});
	};

	/*
	options parameter
		onSkip: function to execute to skip the current task and execute the next task
		onAbort: function to execute to abort the entire synchronization
		onComplete: function to execute
	*/
	DownloadTask.prototype.run = function (options) {
		var pathModule = require('path');
		var directory = pathModule.dirname(fileHelper.wavestackFolder + this.path);
		this.download({
			url: apiHelper.routes.file + "?path=" + this.path,
			dest: directory,
			onComplete: options.onComplete,
			onNetworkError: options.onAbort,
			onFileError: options.onAbort 
		});
	};
}