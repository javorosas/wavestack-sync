if (typeof brokenView === 'undefined') {
	brokenView = {};
	brokenView.attempts = 0;
	brokenView.retry = function () {
		loadTemplate('loading');
	};
	brokenView.init = function () {
		var self = this;
		$(document).ready(function () {
			$('button.retry').click(self.retry);
			self.attempts += 1;
		});
	};
}

brokenView.init();