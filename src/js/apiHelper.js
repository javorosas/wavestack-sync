apiHelper = { };
apiHelper.domain = 'http://www.wavestack.com';
apiHelper.routes = {
	login: apiHelper.domain + '/api/login',
	logout: apiHelper.domain + '/logout',
	info: apiHelper.domain + '/api/info',
	lastSync: apiHelper.domain + '/api/syncDate',
	tree: apiHelper.domain + '/api/tree',
	file: apiHelper.domain + '/api/file',
	folder: apiHelper.domain + '/api/folder',
	renameFile: apiHelper.domain + '/api/rename',
	renameFolder: apiHelper.domain + '/api/renameFolder',
	lastVersion: apiHelper.domain + '/app/lastVersion'
};


/// Callback:
///		err
///		needsUpdate
///		whatsNew
///		current
apiHelper.checkUpdate = function (callback) {
	var current = require('nw.gui').App.manifest.version;
	var appVersion = current.split('.');
	request.get({ url: apiHelper.routes.lastVersion, json: true, callback: function (err, res, body) {
		// DELETE ME ============
		// err = null;
		// body = { success: true, version: "0.9.0" };
		// ======================
		if (err) {
			callback(err);
		} else if (body.success) {
			var newVersion = body.version.split('.');
			// Parse to int
			appVersion = appVersion.map(function (item) { return parseInt(item) });
			newVersion = newVersion.map(function (item) { return parseInt(item) });
			if (newVersion[0] > appVersion[0])
				callback(null, true, body, current);
			else if (newVersion[0] == appVersion[0] && newVersion[1] > appVersion[1]) {
				callback(null, true, body, current);
			} else {
				callback(null, false);
			}
		} else {
			callback('Something went wrong');
		}
	}});
};

apiHelper.checkLogin = function (callbacks) {
	request.get({ url: apiHelper.routes.login, json: true, callback: function (err, response, body) {
		if (err || response.statusCode !== 200) {
			callbacks.onError(err);
		} else if (body.success) {
			callbacks.onSuccess(body);
		} else {
			callbacks.onFail(body);
		}
	}});
};

apiHelper.logout = function (callback) {
	// request.del(apiHelper.routes.login, function (err, res, body) {
	// 	if (err || res.statusCode!== 200) {
	// 		callback(err || body.message, body);
	// 	} else {
	// 		callback(null, body);
	// 	}
		
	// });
	$.ajax({
		url: apiHelper.routes.login,
		type: 'DELETE'
	}).done(function (data) {
		if (data.success) {
			request = require('request');
			callback(null);
		}
	});

	//require('nw.gui').Window.new(apiHelper.routes.logout).on('load');

	
	
};