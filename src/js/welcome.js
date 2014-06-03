if (typeof welcomeView === 'undefined') {
	welcomeView = {};
	welcomeView.init = function () {
		$(document).ready(function () {
			$('h2').append(', ' + currentUser.stageName);
			$('button.next').click(function () {
				loadTemplate('syncing');
			});
			var platform = require('os').platform();
			var $folder = $('div.ws-folder');
			if (/^win/.test(platform)) {
				$folder.css('background-image', 'url(img/folder-win.jpg)');
			} else if (/^linux/.test(platform)) {
				$folder.css('background-image', 'url(img/folder-linux.jpg)');
			} else {
				$folder.css('background-image', 'url(img/folder-osx.jpg)');
			}
		});
	};
}

welcomeView.init();