$(document).ready(function () {
	syncHelper.startSyncing(function (err, status, percentage, task) {
		if (err) {

		} else if (status === syncHelper.statusCode.completed) {
			$('#main .log').append('<div>Sync completed</div>');
			$('#main .progress-bar').css('width', '100%');
			$('#main .progress').removeClass('active');
			$('#main h3').text('Synced');
			loadTemplate('idle');
		} else if (status === syncHelper.statusCode.paused) {
			loadTemplate('idle');
		} else if (status === syncHelper.statusCode.running) {
			$('#main h3').text('Syncing...');
			$('#main .progress-bar').css('width', (percentage * 100) + '%');
			var $log = $('#main .log');
			var message = task.action.present + ': ' + task.path;
			var $newDiv = $('<div class="task" title="' + message + '">' + message + '</div>');
			$log.append($newDiv);
			$newDiv.truncate({
				side: 'center'
			});
			$log.animate({ scrollTop: $log.get(0).scrollHeight }, 1000);
		}
	});
	$('button#hide').click(function () {
		var win = require('nw.gui').Window.get();
		console.log(win);
		win.hide();
	});
	$('button#pause').click(function () {
		syncHelper.pause();
		loadTemplate('settings');
	});
});