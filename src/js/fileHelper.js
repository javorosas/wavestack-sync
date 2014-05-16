fileHelper = {
	createWavestackFolder: function () {
		var fs = require('fs');
		console.log("Creating Wavestack folder...");
		fs.mkdir((process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/Wavestack", function (err) {
			if (err.code == "EEXIST") console.log("Folder already exists.");
		});
	}
};