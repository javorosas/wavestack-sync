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
	renameFolder: apiHelper.domain + '/api/renameFolder'
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
		console.log('## ' + JSON.stringify(data));
		if (data.success) {
			request = require('request');
			callback(null);
		}
	});

	//require('nw.gui').Window.new(apiHelper.routes.logout).on('load');

	
	
};