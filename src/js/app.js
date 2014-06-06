// Make request object global
request = require('request');
// Set default to store cookies on further calls
request = request.defaults({ jar: true });

// Add endsWith function to string
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

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
	tray = new gui.Tray({
		icon: 'img/icon.png',
		tooltip: 'Wavestack ' + gui.App.manifest.version
	});
	win.hide();

	win.on('minimize', function () {
		//this.hide();
	});

	tray.on('click', function () {
		if (loginWindow)
			if (loginWindow.isOpen)
				return false;
		win.restore();
		win.show();
		win.focus();
	});

	win.on('close', function () {
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
			label: 'Exit',
			click: function () {
				gui.App.closeAllWindows();
				exit = true;
				//gui.App.quit();
			}
		})
	);
	menu.append(
		new gui.MenuItem({
			label: 'Wavestack sync ' + gui.App.manifest.version,
			enabled: false
		})
	);

	tray.menu = menu;

	//window.location = "http://www.wavestack.com";
}