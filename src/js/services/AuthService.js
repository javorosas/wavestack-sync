angular.module('AuthService', ['ApiService', 'ConfigService'])
	.factory('Auth', function ($http, Api, Config) {
		return {
			checkLogin: function (callback) {
				Config.getCookie(function (err, cookieString) {
					if (err) return console.log(err);
					if (cookieString) {
						request = require('request');
						var cookie = request.cookie(cookieString);
						var jar = request.jar();
						jar.setCookie(cookie, Api.domain);
						request = request.defaults({ jar: jar });
					}
					request.get({ url: Api.login, json: true, callback: function (err, response, body) {
						if (err || response.statusCode !== 200) {
							callback(err, false);
						} else if (body.success) {
							callback(null, true);
						} else {
							callback(null, false);
						}
					}});
				});
			},
			login: login,
			logout: function (callback) {
				$http.delete(Api.login)
					.success(function (data) {
						request = require('request');
						callback(null);
					});
			}
		};

		/*
		Callback = function (err, success);
		*/
		function login (callback) {
			var gui = require('nw.gui');
			var win = gui.Window.get();
			var success = false;
			
			// Open the login page in a new window
			var loginWindow = gui.Window.open('http://www.wavestack.com/account/applogin', {
				title: 'Wavestack',
				icon: 'img/icon.png',
				position: 'center',
				toolbar: false,
				width: 500,
				height: 600,
				resizable: true,
				'always-on-top': true
			});

			// Hide this window
			// win.close();

			loginWindow.on('loaded', function () {
				var result = loginWindow.window.document.body.innerHTML.trim();
				var splitted = result.split(';');
				if (splitted[0] === 'OK') {
					Config.setCookie(splitted[1], function (err) {
						// request = require('request');
						// var jar = request.jar();
						// jar.setCookie(cookie, Api.domain);
						// request = request.defaults({ jar: jar });
						success = true;
						loginWindow.close();
					});
				} else {
					console.log("SHOW");
					loginWindow.show();
					loginWindow.focus();
				}
			});
				
			loginWindow.on('closed', function () {
				callback(null, success);
			});
		};
	});