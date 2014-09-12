angular.module('LoadingCtrl', ['LoadingService', 'AuthService', 'FileService'])
	.controller('LoadingController', function ($scope, $location, Loading, Auth, File) {
		console.log("LISTEN")
		$scope.broken = false;
		$scope.checkLogin = checkLogin;
		
		Loading.initialize(File.wavestackFolder, function (err) {
			if (err) return console.log(err);
			File.createWavestackFolder(function (err) {
				Loading.checkUpdate(function (err) {
					if (err) console.log(err);
					checkLogin();
				});
			});
		});

		function checkLogin() {
			$scope.broken = false;
			Auth.checkLogin(function (err, isLoggedIn) {
				if (err) {
					console.log(err);
					// Wait 2 seconds before showing the error page, so the user knows it's actually trying to connect.
					setTimeout( function() {
						$scope.broken = true;
						$scope.$apply();
					}, 2000);
				}
				else if (isLoggedIn) {
					console.log('redirecting to /projects');
					$location.path('/projects');
					$scope.$apply();
				}
				else {
					Auth.login(function (err, success) {
						if (success) {
							checkLogin();
						} else {
							console.log('Login window was closed by user');
							exit = true;
							win.close();
						}
					});
				}
			});
		};
	});