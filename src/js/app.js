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
	var gui = require("nw.gui");

	var win = gui.Window.get();
	var tray = new gui.Tray({
			icon: 'img/icon.png'
		});

	win.on('minimize', function () {
		//win.hide();
	});

	tray.on('click', function () {
		win.restore();
		win.show();
		win.focus();
	});

	win.on('close', function () {
		win.minimize();
		return false;
	});

	// Give it a menu
	var menu = new gui.Menu();
	menu.append(
		new gui.MenuItem({
			label: 'Exit',
			click: function () {
				gui.App.closeAllWindows();
				gui.App.quit();
			}
		})
	);
	tray.menu = menu;

	//window.location = "http://www.wavestack.com";
}