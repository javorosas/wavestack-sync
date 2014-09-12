angular.module('LoadingService', ['ApiService'])
	.factory('Loading', function (Api) {
		return {
			initialize: initUI,
			checkUpdate: function (callback) {
				return checkUpdate(Api.lastVersion, callback);
			}
		};
	});

/// Callback:
///		err
///		needsUpdate
///		whatsNew
///		current
function checkUpdate (url, callback) {
	var current = require('nw.gui').App.manifest.version;
	var appVersion = current.split('.');
	request.get({ url: url, json: true, callback: function (err, res, body) {
		if (err) {
			callback(err);
		} else if (body.success) {
			var newVersion = body.version.split('.');
			appVersion = appVersion.map(function (item) { return parseInt(item) });
			newVersion = newVersion.map(function (item) { return parseInt(item) });
			if ((newVersion[0] > appVersion[0]) || (newVersion[0] == appVersion[0] && newVersion[1] > appVersion[1])) {
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
					callback(null);
				});
			} else {
				callback(null);
			}
		} else {
			callback('Something went wrong');
		}
	}});
};


function initUI (wavestackFolder, callback) {
	// Make request object global ==================================================
	request = require('request');
	// Set default to store cookies on further calls ===============================
	request = request.defaults({ jar: true });

	// Add endsWith function to string =============================================
	if (typeof String.prototype.endsWith !== 'function') {
	    String.prototype.endsWith = function (suffix) {
	        return this.indexOf(suffix, this.length - suffix.length) !== -1;
	    };
	}

	// Setup platform ==============================================================
	isWindows = false; isMac = false; isLinux = false;
	var platform = require('os').platform();
	if (/^win/.test(platform)) {
		isWindows = true;
	} else if (/^linux/.test(platform)) {
		isLinux = true;
	} else {
		isMac = true;
	}
	
	exit = false;
	var gui = require("nw.gui");

	win = gui.Window.get();
	win.isVisible = false;
	tray = new gui.Tray({
		icon: 'img/icon_16x16.png'
	});

	win.on('minimize', function () {
		//this.hide();
	});

	win.show2 = function () {
		if (loginWindow) {
			if (loginWindow.isOpen) {
				loginWindow.focus();
				return false;
			}
		}
		win.restore();
		win.show();
		win.focus();
		win.isVisible = true;
		tray.menu.items[1].label = 'Hide';
	};

	tray.on('click', function () {
		win.show2();
	});

	win.on('close', function () {
		win.isVisible = false;
		tray.menu.items[1].label = 'Show';
		if (!exit) {
			this.hide();
			return false;
		} else {
			win.close(true);
		}
	});

	// Give it a menu
	var menu = new gui.Menu();
	menu.append(
		new gui.MenuItem({
			label: 'Wavestack sync ' + gui.App.manifest.version,
			enabled: false
		})
	);
	menu.append(
		new gui.MenuItem({
			label: 'Show',
			click: function () {
				if (win.isVisible)
					win.close();
				else
					win.show2();
			}
		})
	);
	menu.append(
		new gui.MenuItem({
			label: 'Open Wavestack folder',
			click: function () {
				gui.Shell.openItem(wavestackFolder);
			}
		})
	);
	menu.append(
		new gui.MenuItem({
			label: 'Go to my dashboard',
			click: function () {
				var gui = require('nw.gui');
				gui.Shell.openExternal('https://www.wavestack.com/' + currentUser.username);
			}
		})
	);
	menu.append(
		new gui.MenuItem({
			label: 'Exit',
			click: function () {
				gui.App.closeAllWindows();
				exit = true;
				//gui.App.quit();
			}
		})
	);

	tray.menu = menu;

	tray.menu.items.forEach(function (i) {
		if (i.tag === 'sync' || i.tag === 'pause') {
			tray.menu.remove(i);
			return;
		}
	});

	callback(null);
}