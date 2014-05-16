// Not implemented yet

apiHelper = { };
apiHelper.domain: 'http://www.wavestack.com'
apiHelper.routes = {
	login: apiHelper.domain + '/api/login',
	logout: apiHelper.domain + '/logout',
	file: apiHelper.domain + '/api/file',
	fileInfo: apiHelper.domain + '/api/fileInfo',
};

apiHelper.checkLogin: function () {
		$.ajax({
			url: ApiRoutes.LOGIN,
			type: 'GET',
			async: false
		}).done(function (data) {
			return data;
		});
	};
};