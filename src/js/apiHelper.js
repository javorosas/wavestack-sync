apiHelper = { };
apiHelper.domain = 'http://www.wavestack.com';
apiHelper.routes = {
	login: apiHelper.domain + '/api/login',
	logout: apiHelper.domain + '/logout',
	file: apiHelper.domain + '/api/file',
	info: apiHelper.domain + '/api/info',
	tree: apiHelper.domain + '/api/tree'
};

apiHelper.checkLogin = function (callbacks) {
	request.get({ url: apiHelper.routes.login, json: true, callback: function (err, response, body) {
		if (err || response.statusCode !== 200) {
			console.log("HEEY");
			callbacks.onError(err);
		} else if (body.success) {
			console.log("LISTEN");
			callbacks.onSuccess(body);
		} else {
			callbacks.onFail(body);
		}
	}});
};

apiHelper.logout = function () {
	request.get(apiHelper.routes.logout, function (err, res, body) {

	});
};