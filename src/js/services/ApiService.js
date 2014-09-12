angular.module('ApiService', [])
	.factory('Api', function () {
		var domain = 'https://www.wavestack.com';
		return {
			domain: domain,
			login: domain + '/api/login',
			logout: domain + '/logout',
			info: domain + '/api/info',
			lastSync: domain + '/api/syncDate',
			tree: domain + '/api/tree',
			file: domain + '/api/file',
			folder: domain + '/api/folder',
			renameFile: domain + '/api/rename',
			renameFolder: domain + '/api/renameFolder',
			lastVersion: domain + '/app/lastVersion',
			projects: domain + '/api/projects'
		};
	});