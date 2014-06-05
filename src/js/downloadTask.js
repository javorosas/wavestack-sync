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
		var self = this;
		var fs = require('fs-extra');
		var pathModule = require('path');
		// Get the directory path to the destination file
		var directory = options.dest;
		var fileName = directory + "/" + pathModule.basename(this.path);
		var tmpFile = fileHelper.wavestackFolder + '.tmp';
		options.onBegin();
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
					// Write downloaded data to a temporary file, in case download is interrupted
					fs.createWriteStream(tmpFile).on('error', function (error) {
						options.onFileError(error);
					}).on('close', function () {
						// Move the temporary file to the final version. Id file exists, it is overwriten.
						fs.renameSync(tmpFile, fileName);
						// Once downloaded, update the file stamps with info from the server
						request.get({ url: apiHelper.routes.info + '?path=' + encodeURIComponent(self.path), json: true, callback: function (error, response, body) {
							var remoteInfo = body.file;
							// Set modified time to the new file
							var date = new Date(remoteInfo.ModifiedUtc).getTime() / 1000;
							fs.utimes(fileName, date, date);
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
			url: apiHelper.routes.file + '?path=' + this.path,
			dest: directory,
			onBegin: options.onBegin,
			onComplete: options.onComplete,
			onNetworkError: options.onAbort,
			onFileError: options.onAbort 
		});
	};
}