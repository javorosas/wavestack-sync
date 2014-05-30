if (typeof RenameLocalFileTask === 'undefined') {
	RenameLocalFileTask = function (oldPath, newPath) {
		this.path = newPath;
		this.oldPath = oldPath;
	};

	RenameLocalFileTask.prototype.action = {
		past: 'Renamed local',
		present: 'Renaming local'
	};

	/*
	options parameter:
		fileName: full path of the file to delete
		onComplete: the file was deleted
		onError: Something happened
	*/
	RenameLocalFileTask.prototype.renameLocalFile = function(options) {
		var fs = require('fs-extra');
		options.onBegin();
		fs.rename(options.oldPath, options.newPath, function (error) {
			if (!error) {
				options.onComplete();
			} else {
				options.onError(err);
			}
		});
	};

	/*
	options parameter
		onSkip: function to execute to skip the current task and execute the next task
		onAbort: function to execute to abort the entire synchronization
		onComplete: function to execute
	*/
	RenameLocalFileTask.prototype.run = function (options) {
		var pathModule = require('path');
		this.renameLocalFile({
				oldPath: fileHelper.wavestackFolder + this.oldPath,
				newPath: fileHelper.wavestackFolder + this.path,
				onBegin: options.onBegin,
				onComplete: options.onComplete,
				onError: options.onAbort
		});
	};
}