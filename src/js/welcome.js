if (typeof welcomeView === 'undefined') {
	welcomeView = {};
	welcomeView.init = function () {
		$(document).ready(function () {
			$('h2').append(', ' + localStorage.stageName);
			$('button.disconnect').click(function () {
				apiHelper.logout();
				loadingView.hasClosedLoginWindow = false;
				loadTemplate('loading');
			});
		});
	};
}

welcomeView.init();