if (typeof RenameRemoteFileTask === 'undefined') {
	RenameRemoteFileTask = function (oldPath, newPath) {
		this.path = newPath;
		this.oldPath = oldPath;
	};

	RenameRemoteFileTask.prototype.action = {
		past: 'Renamed remote',
		present: 'Renamed remote'
	};

	/*
	WARNING: This method should NOT be by an instance of DowloadTask. To perform the renameRemoteFile please use the 'run' method.
			 This method is not private because I wanted to keep the prototype pattern. Maybe in a future refactor it will be private or
			 moved to another helper.
	options parameter:
		url: url of the file api call
		onComplete: the file finished renameRemoteFile and save
		onNetworkError: Request failed
		onFailed: Maybe the file is in use
	*/
	RenameRemoteFileTask.prototype.renameRemoteFile = function(options) {
		options.onBegin();
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
	RenameRemoteFileTask.prototype.run = function (options) {
		var pathModule = require('path');
		this.renameRemoteFile({
			url: apiHelper.routes.renameFile + '?oldPath=' + encodeURIComponent(this.oldPath) + '&newPath=' + encodeURIComponent(this.path),
			onBegin: options.onBegin,
			onComplete: options.onComplete,
			onNetworkError: options.onAbort,
			onFailed: options.onAbort
		});
	};
}