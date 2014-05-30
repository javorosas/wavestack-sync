var Datastore = require('nedb');
var path = require('path');
var db = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'config-test.db'), autoload: true });

function initUserConfigs(callback) {
	db.findOne({ username: currentUser.username }, function (err, doc) {
		var propertiesToUpdate = {};
		if (doc)
			// If user configs exist, dont update anything
			propertiesToUpdate = { };
		else
			// set user data + initial lastSync
			propertiesToUpdate = { lastSync: "1990-01-01T00:00:00.000Z" };
		
		db.update(
			{ username: currentUser.username },
			{ $set: propertiesToUpdate },
			{ upset: true },
			function () {
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