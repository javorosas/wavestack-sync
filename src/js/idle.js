$(document).ready(function () {
	$resume = $('button.resume');
	if (syncHelper.status === syncHelper.statusCode.completed) {
		$('.status')
			.removeClass('paused')
			.addClass('completed')
			.text('Sync completed');
		$('button.resume').hide();
		$('.last-sync').show();
	} else {
		$('.status')
			.removeClass('completed')
			.addClass('paused')
			.text('Sync paused');
		$resume.show();
		$('.last-sync').hide();
	}
	$resume.on('click', function () {
		loadTemplate('syncing');
	});
	$('.disconnect').on('click', function () {
		apiHelper.logout(function (err, body) {
			console.log(body);
			if (!err) {
				loadTemplate('loading');
			}
		});
	});
	$('#hide').on('click', function () {
		require("nw.gui").Window.get().hide();
	});
	$('.identity .stage-name').text(currentUser.stageName);
	$('.identity .email').text(currentUser.email);
});