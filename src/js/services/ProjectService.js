angular.module('ProjectService', ['ApiService'])
	.factory('Project', function ($http, Api) {
		return {
			getAll: function (callback) {
				request.get({ url: Api.projects, json: true, callback: function (err, res, body) {
					if (err) return callback(err);
					if (res.statusCode !== 200) return callback(res.statusCode);
					return callback(null, body);
				}});
			}
		};
	});