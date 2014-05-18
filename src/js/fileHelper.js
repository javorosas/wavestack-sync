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
		ModifiedDate: "1990-01-01T14:55:58.201Z"
	}
*/
fileHelper.getLocalFiles = function(callback) {
	var recursive = require('recursive-readdir');
	recursive(this.wavestackFolder, function (err, files) {
		if (!err) {
			var cloudFiles = [];
			var fs = require('fs');
			for (var f in files) {
				var stat = f.statSync(f);
				if (stat.isFile()) {
					var relative = f.slice(this.wavestackFolder.length);
					cloudFiles.push({
						RelativePath: relative,
						ModifiedDate: stat.mtime.toISOString()
					});
				}
			}
		}
	});
};