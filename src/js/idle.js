if (typeof idleView === 'undefined') {
	idleView = { };

	idleView.resume = function () {
		loadTemplate('syncing');
	}

	idleView.init = function () {
		tray.menu.items.forEach(function (i) {
			if (i.tag === 'pause') {
				tray.menu.remove(i);
				return;
			}
		});
		var gui = require('nw.gui');
		var item = new gui.MenuItem({
			label: 'Sync now',
			click: function () {
				tray.menu.remove(this);
				idleView.resume();
			}
		});
		item.tag = 'sync';
		tray.menu.insert(item, 2);

		$(document).ready(function () {
			$resume = $('button.resume');
			if (syncHelper.status === syncHelper.statusCode.completed) {
				$('.status')
					.removeClass('paused')
					.addClass('completed')
					.text('Sync completed');
				//$resume.hide();
				$('.last-sync').show();
			} else {
				$('.status')
					.removeClass('completed')
					.addClass('paused')
					.text('Sync paused');
				$resume.show();
				$('.last-sync').hide();
			}
			$resume.on('click', idleView.resume);
			$('.disconnect').on('click', function () {
				apiHelper.logout(function (err, body) {
					if (!err) {
						loadTemplate('loading');
					}
				});
			});
			$('#hide').on('click', function () {
				win.close();
			});
			$('.identity .stage-name').text(currentUser.stageName);
			$('.identity .email').text(currentUser.email);
		});
	};
}

idleView.init();