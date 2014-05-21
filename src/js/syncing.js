$(document).ready(function () {
	syncHelper.startSyncing(function (err, completed, percentage, task) {
		if (err) {

		} else if (completed) {
			$('#main .log').append('<div>Sync completed</div>');
			$('#main .progress-bar').css('width', '100%');
			$('#main h3').text('Synced');
		} else {
			$('#main h3').text('Syncing...');
			$('#main .progress-bar').css('width', (percentage * 100) + '%');
			var $log = $('#main .log');
			$log.append('<div>' + task.action.past + ': ' + task.path + '</div>');
			$log.animate({ scrollTop: $log.children().length * 20 }, 1000);
		}
	});
});