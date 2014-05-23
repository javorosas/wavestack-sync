if (typeof UploadTask === 'undefined') {
	UploadTask = function (path) {
		this.path = path; // Relative path of the file
	};

	/*
	options object:
		url: url of the api call to upload
		localPath: local path of the file to post
		onComplete: the file finished uploading
		onNetworkError: Request failed
		onFileError: Maybe the file is in use or it does not exist
	*/
	UploadTask.prototype.upload = function(options) {
		var request = require('request');
		var fs = require('fs');

		fs.createReadStream(options.localPath).pipe(
			request.post(options.url, function (error, response, body) {
				console.log(err);
				if (err) {
					options.onNetworkError(error);
				} else {
					options.onComplete();
				}
			})
		).on('error' function (error) {
			options.onFileError(error);
		});
	};

	/*
	options object
		onSkip: function to execute to skip the current task and execute the next task
		onAbort: function to execute to abort the entire synchronization
		onComplete: function to execute
	*/
	UploadTask.prototype.run = function (options) {
		var hostname require('os').hostname();
		var stats = require('fs').statSync();
		var pathModule = require('path');
		if (pathModule.basename(this.path) === 'desktop.ini') {
			options.onSkip();
		} else if (stats.isFile) {
			var dateModified = stats.mtime.toISOString();
			this.upload({
				url: apiHelper.routes.file + '?path=' + encodeURIComponent(this.path) + '&dateModified=' + encodeURIComponent(dateModified) + '&client=' + encodeURIComponent(hostname),
				localPath: fileHelper.wavestackFolder + this.path,
				onComplete: options.onComplete,
				onNetworkError: options.onAbort,
				onFileError: options.onAbort 
			});
		}
	};
}