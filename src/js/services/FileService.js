var wavestackFolder = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/Wavestack/";

angular.module('FileService', [])
	.factory('File', function () {
		return {
			wavestackFolder: wavestackFolder,
			getLocalFiles: getLocalFiles,
			createWavestackFolder: createWavestackFolder
		}
	});
/*
	callback = function (err, cloudFiles)
	A CloudFile JSON object has the following structure:
	{
		RelativePath: "path/to/file.txt",
		ModifiedUtc: "1990-01-01T14:55:58.201Z"
	}
*/

function createWavestackFolder(callback) {
	var fs = require('fs');
	fs.mkdir(wavestackFolder, function (err) {
		callback(err);
	});
};

function getLocalFiles(callback) {
	var self = this;
	var recursive = require('recursive-readdir');
	recursive(wavestackFolder, function (err, files) {
		var cloudFiles = [];
		if (!err) {
			var fs = require('fs');
			for (var i in files) {
				var stat = fs.statSync(files[i]);
				if (stat.isFile()) {
					var modified = stat.mtime.toDateString() !== 'Invalid Date' ? stat.mtime : stat.ctime;
					
					var created;
					if (isMac)
						created = stat.ctime;
					else
						created = stat.birthtime ? stat.birthtime : stat.ctime;

					modified.setMilliseconds(0);
					created.setMilliseconds(0);
					var relative = files[i].slice(wavestackFolder.length);

					// If Windows, convert all paths to POSIX style.
					var platform = require('os').platform();
					if (/^win/.test(platform)) {
						relative = relative.replace(/\\/g, '/');
					}
					
					var cloudFile = {
						RelativePath: relative,
						ModifiedUtc: modified.toISOString(),
						CreatedUtc: created.toISOString()
					};
					cloudFiles.push(cloudFile);
				}
			}
		}
		callback(err, cloudFiles);
	});
};