if (typeof RenameRemoteFolderTask === 'undefined') {
	RenameRemoteFolderTask = function (oldPath, newPath) {
		this.path = newPath;
		this.oldPath = oldPath;
	};

	RenameRemoteFolderTask.prototype.action = {
		past: 'Renamed remote',
		present: 'Renamed remote'
	};

	/*
	WARNING: This method should NOT be by an instance of DowloadTask. To perform the renameRemoteFolder please use the 'run' method.
			 This method is not private because I wanted to keep the prototype pattern. Maybe in a future refactor it will be private or
			 moved to another helper.
	options parameter:
		url: url of the file api call
		onComplete: the file finished renameRemoteFolder and save
		onNetworkError: Request failed
		onFailed: Maybe the file is in use
	*/
	RenameRemoteFolderTask.prototype.renameRemoteFolder = function(options) {
		request.post({ url: options.url, json: true, callback: function (err, response, body) {
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
	RenameRemoteFolderTask.prototype.run = function (options) {
		var pathModule = require('path');
		this.renameRemoteFolder({
			url: apiHelper.routes.renameFolder + '?oldPath=' + encodeURIComponent(this.oldPath) + '&newPath=' + encodeURIComponent(this.path),
			onComplete: options.onComplete,
			onNetworkError: options.onAbort,
			onFailed: options.onAbort
		});
	};
}