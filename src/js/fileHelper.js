fileHelper = {
	wavestackFolder: (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/Wavestack/"
};
fileHelper.createWavestackFolder = function () {
	var fs = require('fs');
	fs.mkdir(this.wavestackFolder, function (err) {
	});
};

/*
	callback = function (err, cloudFiles)
	A CloudFile JSON object has the following structure:
	{
		RelativePath: "path/to/file.txt",
		ModifiedUtc: "1990-01-01T14:55:58.201Z"
	}
*/
fileHelper.getLocalFiles = function(callback) {
	var self = this;
	var recursive = require('recursive-readdir');
	recursive(this.wavestackFolder, function (err, files) {
		var cloudFiles = [];
		if (!err) {
			var fs = require('fs');
			for (var i in files) {
				var stat = fs.statSync(files[i]);
				if (stat.isFile()) {
					var modified = stat.mtime.toDateString() !== 'Invalid Date' ? stat.mtime : stat.ctime;
					var created = stat.birthtime < stat.ctime ? stat.birthtime : stat.ctime;
					//modified = stat.ctime > modified ? stat.ctime : modified;
					modified.setMilliseconds(0);
					created.setMilliseconds(0);
					var relative = files[i].slice(self.wavestackFolder.length);

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