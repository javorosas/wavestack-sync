if (typeof DeleteFileLocalTask === 'undefined') {
	DeleteFileLocalTask = function (path) {
		this.path = path;
	};

	DeleteFileLocalTask.prototype.action = {
		past: 'Deleted local',
		present: 'Deleting local'
	};

	/*
	options parameter:
		fileName: full path of the file to delete
		onComplete: the file was deleted
		onError: Something happened
	*/
	DeleteFileLocalTask.prototype.deleteFileLocal = function(options) {
		var fs = require('fs-extra');
		fs.unlink(options.fileName, function (error) {
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
	DeleteFileLocalTask.prototype.run = function (options) {
		var pathModule = require('path');
		// don't delete the desktop.ini file
		if (pathModule.basename(this.path) === 'desktop.ini') {
			options.onSkip();
		} else {
			this.deleteFileLocal({
				file: fileHelper.wavestackFolder + this.path,
				onComplete: options.onComplete,
				onError: options.onAbort
			});
		}
	};
}