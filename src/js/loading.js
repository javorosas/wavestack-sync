if (typeof loadingView === 'undefined') {
	loadingView = {};
	loadingView.hasClosedLoginWindow = false;
	loadingView.init = function () {
		$(document).ready(function () {
			apiHelper.checkLogin({
				// There was an error when attempting to connect to the server
				onError: function () {
					// Wait 2 seconds before showing the error page, so the user knows it's actually trying to connect.
					setTimeout( function() {
						loadTemplate('broken');
					}, 2000);
				},
				// User is logged in
				onSuccess: function (data) {
					loadingView.hasClosedLoginWindow = false;
					currentUser = {
						username: data.username,
						email: data.email,
						stageName: data.stageName
					};
					initUserConfigs(function () {
						loadTemplate('welcome');
					});
				},
				// User is not logged in
				onFail: function () {
					var gui = require('nw.gui');
					var win = gui.Window.get();
					// If the user closed the loginWindow without authenticating, close the app.
					if (loadingView.hasClosedLoginWindow) {
						// Quit current app
						console.log('Login window was closed by user');
						exit = true;
						win.close();
						//gui.App.quit();
					} else {
						// Open the login page in a new window
						loginWindow = gui.Window.open('http://www.wavestack.com/account/applogin', {
							icon: 'img/icon.png',
							position: 'center',
							toolbar: false,
							width: 500,
							height: 600,
							resizable: true
						});
						// Hide this window
						win.hide();
						loginWindow.on('loaded', function () {
							var result = $(loginWindow.window.document.body).text().trim();
							var splitted = result.split(';');
							if (splitted[0] === 'OK') {
								request = require('request');
								jar = request.jar();
								var cookie = request.cookie(splitted[1]);
								console.log(loginWindow.cookie);
								jar.setCookie(cookie, apiHelper.domain);
								request = request.defaults({ jar: jar });
								loginWindow.close();
							}
						});
						
						// At window close, load this page again, so it will check again is the user is logged in
						loginWindow.on('closed', function () {
							win.show();
							loadingView.hasClosedLoginWindow = true;
							loadTemplate('loading');
						});
					}
				}
			});
		});
	};
}

loadingView.init();