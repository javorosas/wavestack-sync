if (typeof welcomeView === 'undefined') {
	welcomeView = {};
	welcomeView.init = function () {
		$(document).ready(function () {
			$('h2').append(', ' + localStorage.stageName);
			$('button.next').click(function () {
				loadTemplate('syncing');
			});
			var platform = require('os').platform;
			var $folder = $('div.ws-folder');
			if (platform == "Windows") {
				$folder.css('background-image', 'url(img/folder-win.jpg)');
			} else {
				$folder.css('background-image', 'url(img/folder-osx.jpg)');
			}
		});
	};
}

welcomeView.init();