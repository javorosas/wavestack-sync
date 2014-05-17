if (typeof DownloadTask === 'undefined') {
	DownloadTask = function (path) {
		this.path = path;
	};

	/*
	options object:
		url: url of the file to get
		dest: local path to save the file
		onComplete: the file finished download and save
		onNetworkError: Request failed
		onFileError: Maybe the file is in use
	*/
	DownloadTask.prototype.download = function(options) {
		var request = require('request');
		var fs = require('fs');
		request.get(options.url, function (error, response, body) {
			if (error || response.statusCode != 200) {
				console.log(err);
				console.log(response.statusCode);
				options.onNetworkError(error);
			}
		}).pipe(
			fs.createWriteStream(options.dest).on('error', function (error) {
				options.onFileError(error);
			}).on('close', function () {
				onComplete();
			})
		);
	};

	/*
	options object
		onSkip: function to execute to skip the current task and execute the next task
		onAbort: function to execute to abort the entire synchronization
		onComplete: function to execute
	*/
	DownloadTask.prototype.run = function (options) {
		this.download({
			url: apiHelper.routes.file + "?path=" + this.path,
			dest: fileHelper.wavestackFolder,
			onComplete: options.onComplete,
			onNetworkError: options.onAbort,
			onFileError: options.onAbort 
		});
	};
}