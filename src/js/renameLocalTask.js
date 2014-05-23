if (typeof RenameFileLocalTask === 'undefined') {
	RenameFileLocalTask = function (oldPath, newPath) {
		this.path = newPath;
		this.oldPath = oldPath;
	};

	RenameFileLocalTask.prototype.action = {
		past: 'Renamed local',
		present: 'Renaming local'
	};

	/*
	options parameter:
		fileName: full path of the file to delete
		onComplete: the file was deleted
		onError: Something happened
	*/
	RenameFileLocalTask.prototype.renameFileLocal = function(options) {
		var fs = require('fs-extra');
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
	RenameFileLocalTask.prototype.run = function (options) {
		var pathModule = require('path');
		this.renameFileLocal({
				oldPath: fileHelper.wavestackFolder + this.oldPath,
				newPath: fileHelper.wavestackFolder + this.path,
				onComplete: options.onComplete,
				onError: options.onAbort
		});
	};
}