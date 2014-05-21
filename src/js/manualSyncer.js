if (typeof manualSyncer === 'undefined') {
    // Singleton
    manualSyncer = {

        // FILTERS
        /// Condition: Local file does not exist AND remote file has a newer modified date than local's LastSync property setting.
        conditionToCreateLocal: function (localFiles) {
            return function (remoteFile) {
                var remoteHasNewerDateThanLocalSync = (new Date(remoteFile.ModifiedUtc)).getTime() > (new Date(localStorage.lastSync)).getTime();
                var localFileNotExists = !localFiles.some(function (localFile, i) {
                    return (localFile.RelativePath === remoteFile.RelativePath);
                });
                return localFileNotExists && remoteHasNewerDateThanLocalSync;
            };
        },
    };
    // CREATE

    /// Download files that don't exist locally
    manualSyncer.getCreateLocalTasks = function (localFiles, remoteFiles) {
        var localLastSync = new Date(localStorage.lastSync);
        var filesToCreate = remoteFiles.filter(this.conditionToCreateLocal(localFiles));
        var tasks = [];
        filesToCreate.forEach(function (file) {
            tasks.push(new DownloadTask(file.RelativePath));
        });
        return tasks;
    };
    /// Upload files that don't exist remotely
    /// Condition: Remote file does not exist AND local file has a newer modified date than remote's LastSync property setting.
    manualSyncer.getCreateRemoteTasks = function (localFiles, remoteFiles) {
        
    };

    // UPDATE

    /// Download new remote files to replace old local files
    /// Condition: Local and remote files exist with the same name AND remote file's modified date is newer than local's.
    manualSyncer.getUpdateLocalTasks = function (localFiles, remoteFiles) {
        
    },

    /// Upload new local files to replace old remote files.
    /// Condition: Local and remote files exist with the same name AND local file's modified date is newer than remote's.
    manualSyncer.getUpdateRemoteTasks = function (localFiles, remoteFiles) {
        
    };

    // DELETE

    /// Delete local file when remote file ceased to exist.
    /// Condition: Remote file does not exist AND local file's modified date is older than remote's LastSync AND local file's
    ///            modified date is older than local's LastSync.
    manualSyncer.getDeleteLocalTasks = function (localFiles, remoteFiles) {
        
    };

    // Delete remote file when local file ceased to exist.
    // Condition: Local file does not exist AND remote file's modified date is older than local's LastSync.
    manualSyncer.getDeleteRemoteTasks = function (localFiles, remoteFiles) {
        
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
    manualSyncer.getTasks = function (callback) {
        var self = this;
        // first, get a list of cloudFiles from the server
        request({ url: apiHelper.routes.tree, json: true, callback: function (err, response, body) {
            if (!err && response.statusCode === 200) {
                var remoteFiles = body.tree;
                // Now get a list of localFiles
                fileHelper.getLocalFiles(function (err, localFiles) {
                    if (err) {
                        callback(err);
                    }
                    else {
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