angular.module('ProjectCtrl', ['ProjectService'])
	.controller('ProjectController', function ($scope, Project) {
		$scope.projects = [];
		$scope.data = { value: 'not loaded' };
		Project.getAll(function (err, data) {
				if (err) return console.log(err);
				if (!data.success) return console.log(data);
				data.projects.forEach(function (project) {
					project.statusLabel = 'Looking for changes...';
					project.title = project.title + " perdido de los pájaros azules misteriosos del espacio experior";
				});
				$scope.projects = data.projects;
				$scope.data = data;
				$scope.$apply();
			});

	});