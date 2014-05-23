if (!localStorage.lastSync) {
	localStorage.lastSync = "1990-01-01T00:00:00.000Z";
}
// Singleton
if (!this.syncHelper) {
	syncHelper = {
		pendingTasks: [],
		statusCode: {
			running: 0,
			completed: 1,
			paused: 2,
			aborted: 3
		},
		pauseRequested: false
	};
	syncHelper.status = syncHelper.statusCode.completed;
	
	syncHelper.runPending = function (callback) {
		var self = this;
		var next = function () {
			var task = self.pendingTasks.shift();
			if (self.cancelRequested) {
				pauseRequested = false;
				self.status = self.statusCode.paused;
				callback(null, self.statusCode.paused);
			} else if (task) {
				task.run({
					onSkip: next,
					onAbort: function () {
						var error = { aborted: true };
						callback(error);
					},
					onComplete: function () {
						self.status = self.statusCode.running;
						// Report progress
						callback(/*error*/ null, /*status*/ self.statusCode.running, /*task*/ task);
						next();
					}
				});
			} else {
				self.status = self.statusCode.completed;
				callback(null, self.statusCode.completed);
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
				self.runPending(function (error, status, task) {
					var percentage = self.pendingTasks.length / total;
					percentage = percentage < 1 ? 1 - percentage : 0;
					if (!error) {
						callback(error, status, percentage, task);
					} else {
						callback(error);
					}
				});
			} else {
				callback(err);
			}
		});
	};

	syncHelper.stopSyncing = function (callback) {

	};
}