var Datastore = require('nedb');
var path = require('path');
var dir = require('nw.gui').App.dataPath;
var dest = path.join(dir, 'config.db');
require('fs-extra').mkdirsSync(dir);
var db = new Datastore({ filename: dest, autoload: true });

angular.module('ConfigService', [])
	.factory('Config', function () {
		return {
			getCookie: getCookie,
			setCookie: setCookie,
			initUserConfigs: initUserConfigs,
			getLastSyncLocal: getLastSyncLocal,
			setLastSyncLocal: setLastSyncLocal
		}

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

		function getCookie(callback) {
			db.findOne({ setting: 'lastCookie' }, function (err, setting) {
				if (!setting)
					return callback(err, null);
				else
					return callback(err, setting.value);
			});
		}

		function setCookie(value, callback) {
			db.update({ setting: 'lastCookie' }, { $set: { value: value } }, { upsert: true }, function (err) {
				callback(err);
			});
		}

		function getLastSyncLocal(callback) {
			db.findOne({ username: currentUser.username }, function (err, doc) {
				if (!doc)
					callback(err, null);
				else
					callback(err, doc.lastSync);
			});
		}

		function setLastSyncLocal(syncDate, callback) {
			db.update({ username: currentUser.username }, { $set: { lastSync: syncDate } }, { upsert: true }, function (err) {
				callback(err);
			});
		}
	});