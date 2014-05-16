if (typeof welcomeView === 'undefined') {
	welcomeView = {};
	welcomeView.init = function () {
		$(document).ready(function () {
			$('h2').append(', ' + localStorage.stageName);
		});
	};
}

welcomeView.init();