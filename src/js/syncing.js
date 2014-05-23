$(document).ready(function () {
	syncHelper.startSyncing(function (err, status, percentage, task) {
		if (err) {

		} else if (status == syncHelper.statusCode.completed) {
			$('#main .log').append('<div>Sync completed</div>');
			$('#main .progress-bar').css('width', '100%');
			$('#main .progress').removeClass('active');
			$('#main h3').text('Synced');
		} else if (status = syncHelper.statusCode.running) {
			$('#main h3').text('Syncing...');
			$('#main .progress-bar').css('width', (percentage * 100) + '%');
			var $log = $('#main .log');
			$log.append('<div>' + task.action.past + ': ' + task.path + '</div>');
			$log.animate({ scrollTop: $log.children().length * 20 }, 1000);
		}
	});
});