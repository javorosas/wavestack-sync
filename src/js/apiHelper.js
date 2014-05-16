apiHelper = { };
apiHelper.domain = 'http://www.wavestack.com';
apiHelper.routes = {
	login: apiHelper.domain + '/api/login',
	logout: apiHelper.domain + '/logout',
	file: apiHelper.domain + '/api/file',
	fileInfo: apiHelper.domain + '/api/fileInfo',
};

apiHelper.checkLogin = function (callbacks) {
	$.ajax({
		url: apiHelper.routes.login,
		type: 'GET',
		error: callbacks.onError
	}).done(function (data) {
		if (data.success)
			callbacks.onSuccess(data);
		else
			callbacks.onFail();
	});
};

apiHelper.logout = function () {
	$.ajax({
		url: apiHelper.routes.logout,
		type: 'GET',
		async: false
	}).done(function (data) {
	});
};