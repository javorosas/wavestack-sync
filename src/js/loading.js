if (typeof loadingView === 'undefined') {
	loadingView = {};
	loadingView.hasClosedLoginWindow = false;
	loadingView.init = function () {
		$(document).ready(function () {
			$.ajax({
				url: 'http://www.wavestack.com/api/login',
				type: 'GET',
				error: function () {
					// Wait 2 seconds before showing the error page, so the user knows it's actually trying to connect.
					setTimeout( function() {
						loadTemplate('broken');
					}, 2000);
				}
			}).done(function (data) {
				if (data.success === true) {
					localStorage.username = data.username;
					localStorage.email = data.email;
					localStorage.stageName = data.stageName;
					loadTemplate('welcome');
				} else {
					var gui = require('nw.gui');
					var win = gui.Window.get();
					if (loadingView.hasClosedLoginWindow) {
						win = gui.Window.get();
						win.close(true);
					} else {
						var loginWindow = gui.Window.open('http://www.wavestack.com/account/applogin', {
							icon: 'img/icon.png',
							position: 'center',
							toolbar: false,
							width: 500,
							height: 600,
							resizable: true
						});
						win.hide();
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