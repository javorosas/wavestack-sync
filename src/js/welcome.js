if (typeof welcomeView === 'undefined') {
	welcomeView = {};
	welcomeView.init = function () {
		win.show2();
		$(document).ready(function () {
			$('h2').append(', ' + currentUser.stageName);
			$('button.next').click(function () {
				loadTemplate('syncing');
			});
			var $folder = $('div.ws-folder');
			if (isWindows) {
				$folder.css('background-image', 'url(img/folder-win.jpg)');
			} else if (isLinux) {
				$folder.css('background-image', 'url(img/folder-linux.jpg)');
			} else {
				$folder.css('background-image', 'url(img/folder-osx.jpg)');
			}
		});
	};
}

welcomeView.init();