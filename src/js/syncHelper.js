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
		pauseRequested: false,
		somethingChanged: false
	};
	syncHelper.status = syncHelper.statusCode.completed;
	
	syncHelper.runPending = function (callback) {
		var self = this;
		var next = function () {
			var task = self.pendingTasks.shift();
			if (self.pauseRequested) {
				self.status = self.statusCode.paused;
				callback(null, self.statusCode.paused);
			} else if (task) {
				task.run({
					onBegin: function () {
						callback(null, self.statusCode.running, task);
					},
					onSkip: next,
					onAbort: function (err) {
						self.status = self.statusCode.aborted;
						callback(err, self.statusCode.aborted);
					},
					onComplete: function () {
						//self.status = self.statusCode.running;
						// Report progress
						// callback(/*error*/ null, /*status*/ self.statusCode.running, /*task*/ task);
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
		self.pauseRequested = false;
		this.getLastSync(function (err, lastSyncLocal, lastSyncRemote) {
			manualSyncer.getTasks(lastSyncLocal, lastSyncRemote, function (err, syncTasks) {
				if (!err) {
					self.pendingTasks = self.pendingTasks.concat(syncTasks);
					var total = self.pendingTasks.length;
					self.somethingChanged = total > 0;
					self.runPending(function (error, status, task) {
						var percentage = (self.pendingTasks.length + 1) / total;
						percentage = percentage < 1 ? 1 - percentage : 0;
						if (status === self.statusCode.completed) {
							self.updateLastSync(lastSyncLocal, lastSyncRemote, function (err) {
								if (!err) {
									callback(error, status, percentage, task);
								} else {
									callback(err);
								}
							});
						} else {
							callback(error, status, percentage, task);
						}
					});
				} else {
					callback(err);
				}
			});
		});
		//autoSyncer.startWatching();
	};

	syncHelper.getLastSync = function (callback) {
		getLastSyncLocal(function (lastSyncLocal) {
			var localDate = new Date(lastSyncLocal);
            localDate.setMilliseconds(0);
            lastSyncLocal = localDate.toISOString();
			request.get({ url: apiHelper.routes.lastSync, json: true, callback: function (err, response, body) {
                if (!err && response.statusCode === 200) {
                    var lastSyncRemote = body.date;
                    
                    // Truncate millis
                    var remoteDate = new Date(lastSyncRemote);
                    remoteDate.setMilliseconds(0);
                    lastSyncRemote = remoteDate.toISOString();

                    callback(err, lastSyncLocal, lastSyncRemote);
                } else {
                	callback(err || body.message);
                }
            }});
		});
	};

	syncHelper.pause = function (callback) {
		this.pauseRequested = true;
	};

	syncHelper.updateLastSync = function (lastSyncLocal, lastSyncRemote, callback) {
		var last = null;
		if (this.somethingChanged)
			last = (new Date()).toISOString();
		else
			last = (new Date(lastSyncLocal)).getTime() > (new Date(lastSyncRemote)).getTime() ? lastSyncLocal : lastSyncRemote;
		setLastSyncLocal(last, function () {
			request.post({ url: apiHelper.routes.lastSync + "lastSyncUtc=" + encodeURIComponent(last), json: true, callback: function (err, response, body) {
                if (!err && response.statusCode === 200) {
                    callback();
                } else {
                	callback(err || body.message);
                }
            }});
		});
	};
}