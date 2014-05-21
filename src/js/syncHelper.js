if (!localStorage.lastSync) {
	localStorage.lastSync = "1990-01-01T00:00:00.000Z";
}
// Singleton
if (!this.syncHelper) {
	syncHelper = {
		pendingTasks: []
	};
	
	syncHelper.runPending = function (callback) {
		var self = this;
		var next = function () {
			var task = self.pendingTasks.shift();
			if (task) {
				task.run({
					onSkip: next,
					onAbort: function () {
						var error = { aborted: true };
						callback(error);
					},
					onComplete: function () {
						// Report progress
						callback(/*error*/ null, /*completed*/ false, /*task*/ task);
						next();
					}
				});
			} else {
				callback(null, true);
			}
		};
		next();
	};
	
	syncHelper.startSyncing = function (callback) {
		var self = this;
		manualSyncer.getTasks(function (err, syncTasks) {
			if (!err) {
				self.pendingTasks = self.pendingTasks.concat(syncTasks);
				var total = self.pendingTasks.length;
				self.runPending(function (error, completed, task) {
					var percentage = self.pendingTasks.length / total;
					percentage = percentage < 1 ? 1 - percentage : 0;
					if (!error) {
						callback(error, completed, percentage, task);
					} else {
						callback(error);
					}
				});
			} else {
				callback(err);
			}
		});
	};
}