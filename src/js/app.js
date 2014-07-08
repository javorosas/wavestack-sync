// Make request object global ==================================================
request = require('request');
// Set default to store cookies on further calls ===============================
request = request.defaults({ jar: true });

// Add endsWith function to string =============================================
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
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

// Public functions ============================================================

function loadTemplate(file) {
	// Support template name convention
	if (!file.endsWith('.html')) file += '.html';
	// Load the file content to the #main container.
	var $container = $('#main');
	$container.load(file);
	// Execute inserted scripts
	var $scripts = $container.find('script');
	$scripts.each(function (index, element) {
		eval(element.innerHTML); //run script inside div
	});
}

function initUI () {
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
				gui.Shell.openItem(fileHelper.wavestackFolder);
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

	//window.location = "http://www.wavestack.com";
}