if (typeof UploadTask === 'undefined') {
	UploadTask = function (path, dateModified) {
		this.path = path; // Relative path of the file
		this.dateModified = dateModified;
	};

	UploadTask.prototype.action = {
		past: 'Uploaded',
		present: 'Uploading'
	};

	/*
	options object:
		url: url of the api call to upload
		path: relative path
		date: date modified
		client: computer name
		localPath: local path of the file to post
		onComplete: the file finished uploading
		onNetworkError: Request failed
		onFileError: Maybe the file is in use or it does not exist
	*/
	UploadTask.prototype.upload = function(options) {
		var fs = require('fs');
		var pathModule = require('path');
		options.onBegin();
		var file = fs.readFileSync(options.localPath);
		//options.onBegin();
		request.post({ 
			url: options.url,
			headers: {
		        'content-type' : 'multipart/form-data'
		    },
			multipart: [{
		        "Content-Disposition": 'form-data; name="file"; filename="' + pathModule.basename(options.localPath) + '"',
		        "Content-Type": "application/octet-stream",
		        body: file
		    }, {
		    	'Content-Disposition' : 'form-data; name="path"',
        		body: options.path
		    }, {
		    	'Content-Disposition' : 'form-data; name="dateModified"',
        		body: options.date
		    }, {
		    	'Content-Disposition' : 'form-data; name="client"',
        		body: options.client
		    }],
			callback: function (error, response, body) {
				if (response.statusCode === 200) body = JSON.parse(body);
				if (error || !body.success) {
					console.log(error || body.message);
					options.onNetworkError(error);
				} else {
					options.onComplete();
				}
			}
		});
	};

	/*
	options object
		onSkip: function to execute to skip the current task and execute the next task
		onAbort: function to execute to abort the entire synchronization
		onComplete: function to execute
	*/
	UploadTask.prototype.run = function (options) {
		var hostname = require('os').hostname();
		var filePath = fileHelper.wavestackFolder + this.path;
		var stats = require('fs').statSync(filePath);
		var pathModule = require('path');
		if (pathModule.basename(this.path) === 'desktop.ini') {
			options.onSkip();
		} else if (stats.isFile) {
			var dateModified = this.dateModified;
			this.upload({
				url: apiHelper.routes.file,
				path: this.path,
				date: dateModified,
				client: hostname,
				localPath: filePath,
				onBegin: options.onBegin,
				onComplete: options.onComplete,
				onNetworkError: options.onAbort,
				onFileError: options.onAbort 
			});
		}
	};
}