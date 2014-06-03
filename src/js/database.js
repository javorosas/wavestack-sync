var Datastore = require('nedb');
var path = require('path');
var dir = require('nw.gui').App.dataPath;
var dest = path.join(dir, 'config-test.db');
require('fs-extra').mkdirsSync(dir);
db = new Datastore({ filename: dest, autoload: true });

function initUserConfigs(callback) {
	db.findOne({ username: currentUser.username }, function (err, doc) {
		var propertiesToUpdate = {};
		if (doc) {
			// If user configs exist, dont update anything
			propertiesToUpdate = { };
		} else {
			// set user data + initial lastSync
			propertiesToUpdate = { lastSync: "1990-01-01T00:00:00.000Z" };
		}
		db.update(
			{ username: currentUser.username },
			{ $set: propertiesToUpdate },
			{ upsert: true },
			function (err, numReplaced, newDoc) {
				callback();
			}
		);
	});
}

function getLastSyncLocal(callback) {
	db.findOne({ username: currentUser.username }, function (err, doc) {
		callback(doc.lastSync);
	});
}

function setLastSyncLocal(syncDate, callback) {
	db.update({ username: currentUser.username }, { $set: { lastSync: syncDate } }, {}, function () {
		callback();
	});
}