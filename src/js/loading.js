if (typeof loadingView === 'undefined') {
	loadingView = {
		hasClosedLoginWindow: false,
		firstLogin: false,
		updateChecked: false
	};
	
	loadingView.login = function () {
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
					stageName: data.stageName,
					id: data.id
				};
				mixpanel.identify(currentUser.id);
				initUserConfigs(function () {
					if (loadingView.firstLogin)
						loadTemplate('welcome');
					else
						loadTemplate('syncing');
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
						title: 'Wavestack',
						icon: 'img/icon.png',
						position: 'center',
						toolbar: false,
						width: 500,
						height: 600,
						resizable: true
					});
					loginWindow.isOpen = true;
					// Hide this window
					// win.close();
					loginWindow.on('loaded', function () {
						var result = $(loginWindow.window.document.body).text().trim();
						var splitted = result.split(';');
						if (splitted[0] === 'OK') {
							request = require('request');
							var jar = request.jar();
							var cookie = request.cookie(splitted[1]);
							jar.setCookie(cookie, apiHelper.domain);
							request = request.defaults({ jar: jar });
							loginWindow.close();
						} else {
							loginWindow.show();
							loginWindow.focus();
							loadingView.firstLogin = true;
						}
					});
					
					// At window close, load this page again, so it will check again is the user is logged in
					loginWindow.on('closed', function () {
						loadingView.hasClosedLoginWindow = true;
						loginWindow.isOpen = false;
						loadTemplate('loading');
					});
				}
			}
		});
	};

	loadingView.init = function () {
		

		$(document).ready(function () {
			apiHelper.checkUpdate(function (err, needsUpdate, update, current) {
				if (!err && needsUpdate && !loadingView.updateChecked) {
					loadingView.updateChecked = true;
					updateInfo = { update: update, current: current };
					// Open update dialog
					var gui = require('nw.gui');
					var updateWindow = gui.Window.open('app://root/update.html', {
						title: 'Wavestack',
						icon: 'img/icon.png',
						position: 'center',
						toolbar: false,
						width: 500,
						height: 180,
						resizable: false
					});

					updateWindow.on('loaded', function () {
						updateWindow.show();
						updateWindow.focus();
					});
					
					updateWindow.on('closed', function () {
						loadingView.login();
					});
				} else {
					loadingView.login();
				}
			});
		});
	};
}

loadingView.init();