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
				win.close(true);
			}
		})
	);
	tray.menu = menu;
}