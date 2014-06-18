if (typeof manualSyncer === 'undefined') {
    // Singleton
    manualSyncer = {
        lastSyncRemote: '',
        lastSyncLocal: '',

        // FILTERS
        /// Condition: Remote file does not exist locally AND remote file has a newer modified date than local's LastSync.
        conditionToCreateLocal: function (localFiles) {
            var self = this;
            return function (remoteFile) {
                var remoteHasNewerDateThanLocalSync = (new Date(remoteFile.ModifiedUtc)).getTime() > (new Date(self.lastSyncLocal)).getTime();
                var remoteFileNotExistLocally = !localFiles.some(function (localFile) {
                    var result = localFile.RelativePath === remoteFile.RelativePath;
                    return result;
                });
                var passed = remoteFileNotExistLocally && remoteHasNewerDateThanLocalSync;
                return passed;
            };
        },

        /// Condition: Local file does not exist remotely AND local file has a newer creation date than remote's LastSync.
        conditionToCreateRemote: function (remoteFiles) {
            var self = this;
            return function (localFile) {
                var localFileNotExistRemotely = !remoteFiles.some(function (remoteFile) {
                    var result = remoteFile.RelativePath === localFile.RelativePath;
                    return result;
                });
                var localHasNewerDateThanRemoteSync = (new Date(localFile.CreatedUtc)).getTime() > (new Date(self.lastSyncRemote)).getTime();
                var passed = localFileNotExistRemotely && localHasNewerDateThanRemoteSync;
                return passed;
            };
        },

        /// Condition: Local and remote files exist with the same name AND remote file's modified date is newer than local's.
        conditionToUpdateLocal: function (localFiles) {
            var self = this;
            return function (remoteFile) {
                var condition = localFiles.some(function (localFile) {
                    var localAndRemoteFileExist = localFile.RelativePath === remoteFile.RelativePath;
                    var remoteFileIsNewerThanLocal = (new Date(remoteFile.ModifiedUtc)).getTime() > (new Date(localFile.ModifiedUtc)).getTime();
                    var result = localAndRemoteFileExist && remoteFileIsNewerThanLocal;
                    return result;
                });
                return condition;
            };
        },

        /// Condition: Local and remote files exist with the same name AND local file's modified date is newer than remote's.
        conditionToUpdateRemote: function (remoteFiles) {
            var self = this;
            return function (localFile) {
                var condition = remoteFiles.some(function (remoteFile) {
                    var localAndRemoteFileExist = localFile.RelativePath === remoteFile.RelativePath;
                    var localFileIsNewerThanRemote = (new Date(localFile.ModifiedUtc)).getTime() > (new Date(remoteFile.ModifiedUtc)).getTime();
                    var result = localAndRemoteFileExist && localFileIsNewerThanRemote;
                    return result;
                });
                return condition;
            };
        },

        /// Condition: Local file does not exist remotely AND remote's lastSync is newer than local file's modified date AND local's lastSync
        ///            is newer than local file's creation time.
        conditionToDeleteLocal: function (remoteFiles) {
            var self = this;
            return function (localFile) {
                var localFileNotExistRemotely = !remoteFiles.some(function (remoteFile) {
                    return (remoteFile.RelativePath === localFile.RelativePath);
                });
                var remoteSyncIsNewerThanLocalFile = (new Date(self.lastSyncRemote)).getTime() > (new Date(localFile.ModifiedUtc)).getTime();
                var localSyncIsNewerThanLocalFile = (new Date(self.lastSyncLocal)).getTime() > (new Date(localFile.CreatedUtc)).getTime();
                return localFileNotExistRemotely && remoteSyncIsNewerThanLocalFile && localSyncIsNewerThanLocalFile;
            };
        },

        // Condition: Remote file does not exist locally AND local's lastSync is newer than remote file.
        conditionToDeleteRemote: function (localFiles) {
            var self = this;
            return function (remoteFile) {
                var remoteFileNotExistLocally = !localFiles.some(function (localFile) {
                    return (localFile.RelativePath === remoteFile.RelativePath);
                });
                var localSyncIsNewerThanRemoteFile = (new Date(self.lastSyncLocal)).getTime() > (new Date(remoteFile.ModifiedUtc)).getTime();
                return remoteFileNotExistLocally && localSyncIsNewerThanRemoteFile;
            };
        }
    };
    // CREATE

    /// Download files that don't exist locally
    manualSyncer.getCreateLocalTasks = function (localFiles, remoteFiles) {
        var filesToCreate = remoteFiles.filter(this.conditionToCreateLocal(localFiles));
        var tasks = [];
        filesToCreate.forEach(function (file) {
            tasks.push(new DownloadTask(file.RelativePath));
        });
        return tasks;
    };
    /// Upload files that don't exist remotely
    manualSyncer.getCreateRemoteTasks = function (localFiles, remoteFiles) {
        var filesToCreate = localFiles.filter(this.conditionToCreateRemote(remoteFiles));
        var tasks = [];
        filesToCreate.forEach(function (file) {
            tasks.push(new UploadTask(file.RelativePath, file.ModifiedUtc));
        });
        return tasks;
    };

    // UPDATE

    /// Download new remote files to replace old local files
    manualSyncer.getUpdateLocalTasks = function (localFiles, remoteFiles) {
        var filesToUpdate = remoteFiles.filter(this.conditionToUpdateLocal(localFiles));
        var tasks = [];
        filesToUpdate.forEach(function (file) {
            tasks.push(new DownloadTask(file.RelativePath));
        });
        return tasks;
    },

    /// Upload new local files to replace old remote files.
    manualSyncer.getUpdateRemoteTasks = function (localFiles, remoteFiles) {
        var filesToUpdate = localFiles.filter(this.conditionToUpdateRemote(remoteFiles));
        var tasks = [];
        filesToUpdate.forEach(function (file) {
            tasks.push(new UploadTask(file.RelativePath, file.ModifiedUtc));
        });
        return tasks;
    };

    // DELETE

    /// Delete local file when remote file ceased to exist.
    manualSyncer.getDeleteLocalTasks = function (localFiles, remoteFiles) {
        var filesToDelete = localFiles.filter(this.conditionToDeleteLocal(remoteFiles));
        var tasks = [];
        filesToDelete.forEach(function (file) {
            tasks.push(new DeleteLocalFileTask(file.RelativePath));
        });
        return tasks;
    };

    // Delete remote file when local file ceased to exist.
    manualSyncer.getDeleteRemoteTasks = function (localFiles, remoteFiles) {
        var filesToDelete = remoteFiles.filter(this.conditionToDeleteRemote(localFiles));
        var tasks = [];
        filesToDelete.forEach(function (file) {
            tasks.push(new DeleteRemoteFileTask(file.RelativePath));
        });
        return tasks;
    };


    manualSyncer.getCrudTasks = function(localFiles, remoteFiles) {
        var tasks = [];
        var createLocalTasks = this.getCreateLocalTasks(localFiles, remoteFiles);
        tasks = tasks.concat(createLocalTasks);
        tasks = tasks.concat(this.getCreateRemoteTasks(localFiles, remoteFiles));
        tasks = tasks.concat(this.getUpdateLocalTasks(localFiles, remoteFiles));
        tasks = tasks.concat(this.getUpdateRemoteTasks(localFiles, remoteFiles));
        tasks = tasks.concat(this.getDeleteLocalTasks(localFiles, remoteFiles));
        tasks = tasks.concat(this.getDeleteRemoteTasks(localFiles, remoteFiles));
        return tasks;
    };
    /*
    callback = function(err, syncTasks);
    syncTasks is an syncTask Array
    */
    manualSyncer.getTasks = function (lastSyncLocal, lastSyncRemote, callback) {
        var self = this;
        
        self.lastSyncLocal = lastSyncLocal;
        self.lastSyncRemote = lastSyncRemote;
        // get a list of cloudFiles from the server
        request({ url: apiHelper.routes.tree, json: true, callback: function (err, response, body) {
            if (!err && response.statusCode === 200) {
                var remoteFiles = body.tree;
                // Truncate milliseconds, since node seems to truncate system's
                remoteFiles.forEach(function (file) {
                    var date = new Date(file.ModifiedUtc);
                    date.setMilliseconds(0);
                    file.ModifiedUtc = date.toISOString();
                });
                // Now get a list of localFiles
                fileHelper.getLocalFiles(function (err, localFiles) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        // model = {
                        //     localFiles: localFiles,
                        //     remoteFiles: remoteFiles,
                        //     localSync: lastSyncLocal,
                        //     remoteSync: lastSyncRemote
                        // };
                        // loadTemplate('log');

                        // Get their tasks
                        var syncTasks = self.getCrudTasks(localFiles, remoteFiles);
                        callback(err, syncTasks);
                    }
                });
            } else {
                callback(err, []);
            }
        }});
    };
}