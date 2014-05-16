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
					localStorage.username = data.username;
					localStorage.email = data.email;
					localStorage.stageName = data.stageName;
					loadTemplate('welcome');
				},
				// User is not logged in
				onFail: function () {
					var gui = require('nw.gui');
					var win = gui.Window.get();
					// If the user closed the loginWindow without authenticating, close the app.
					if (loadingView.hasClosedLoginWindow) {
						// Quit current app
						win.hide();
						gui.App.quit();
					} else {
						// Open the login page in a new window
						var loginWindow = gui.Window.open('http://www.wavestack.com/account/applogin', {
							icon: 'img/icon.png',
							position: 'center',
							toolbar: false,
							width: 500,
							height: 600,
							resizable: true
						});
						// Hide this window
						win.hide();
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