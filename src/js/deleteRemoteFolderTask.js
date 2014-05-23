if (typeof DeleteRemoteFolderTask === 'undefined') {
	DeleteRemoteFolderTask = function (path) {
		this.path = path;
	};

	DeleteRemoteFolderTask.prototype.action = {
		past: 'Deleted remote',
		present: 'Deleting remote'
	};

	/*
	WARNING: This method should NOT be by an instance of DowloadTask. To perform the deleteRemoteFolder please use the 'run' method.
			 This method is not private because I wanted to keep the prototype pattern. Maybe in a future refactor it will be private or
			 moved to another helper.
	options parameter:
		url: url of the file api call
		onComplete: the file finished deleteRemoteFolder and save
		onNetworkError: Request failed
		onFailed: Maybe the file is in use
	*/
	DeleteRemoteFolderTask.prototype.deleteRemoteFolder = function(options) {
		request.del({ url: options.url, json: true, callback: function (err, response, body) {
			if (err || response.statusCode != 200) {
				options.onNetworkError(err);
			} else if (!body.success) {
				options.onFailed(body.message);
			} else {
				options.onComplete();
			}
		}});
	};

	/*
	options parameter
		onSkip: function to execute to skip the current task and execute the next task
		onAbort: function to execute to abort the entire synchronization
		onComplete: function to execute
	*/
	DeleteRemoteFolderTask.prototype.run = function (options) {
		this.deleteRemoteFolder({
			url: apiHelper.routes.folder + '?path=' + this.path,
			onComplete: options.onComplete,
			onNetworkError: options.onAbort,
			onFailed: options.onAbort 
		});
	};
}