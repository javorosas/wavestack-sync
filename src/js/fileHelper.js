fileHelper = {
	wavestackFolder: (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/Wavestack/"
};
fileHelper.createWavestackFolder = function () {
	var fs = require('fs');
	console.log("Creating Wavestack folder...");
	fs.mkdir(this.wavestackFolder, function (err) {
		if (err.code == "EEXIST") console.log("Folder already exists.");
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
					modified = stat.birthtime > modified ? stat.birthtime : modified;
					var relative = files[i].slice(self.wavestackFolder.length);
					cloudFiles.push({
						RelativePath: relative,
						ModifiedUtc: modified.toISOString()
					});
				}
			}
		}
		callback(err, cloudFiles);
	});
};