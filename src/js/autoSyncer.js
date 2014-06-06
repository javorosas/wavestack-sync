if (typeof autoSyncer === 'undefined') {
    // Singleton
    autoSyncer = {};
    
    autoSyncer.startWatching = function(callback) {
        console.log("START GAZING");
        var Gaze = require('gaze').Gaze;
        var pattern = '**/*';
        var folder = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/Wavestack";
        var options = {
            cwd: folder
        };
        var gaze = new Gaze(pattern, options, function(err, watcher) {
          // Files have all started watching
          // watcher === this
          if (err) {
            console.log("ERROR: " + err);
            // Get all watched files
              this.watched(function(watched) {
                console.log("FILE: " + JSON.stringify(watched));
              });
          } else {
              // On file changed
              this.on('changed', function(filepath) {
                console.log(filepath + ' was changed');
              });

              // On file added
              this.on('added', function(filepath) {
                console.log(filepath + ' was added');
              });

              // On file deleted
              this.on('deleted', function(filepath) {
                console.log(filepath + ' was deleted');
              });

              // On changed/added/deleted
              this.on('renamed', function(oldPath, newPath) {
                console.log(oldPath + ' was renamed to ' + newPath);
              });
          }
        });

    };

    // autoSyncer.startWatching = function(callback) {
    //     var chokidar = require('chokidar');

    //     var watcher = chokidar.watch((process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/Wavestack", {ignored: /[\/\\]\./, persistent: true});

    //     watcher
    //       .on('add', function(path) {console.log('File', path, 'has been added');})
    //       .on('addDir', function(path) {console.log('Directory', path, 'has been added');})
    //       .on('change', function(path) {console.log('File', path, 'has been changed');})
    //       .on('unlink', function(path) {console.log('File', path, 'has been removed');})
    //       .on('unlinkDir', function(path) {console.log('Directory', path, 'has been removed');})
    //       .on('error', function(error) {console.error('Error happened', error);});
    //     // Only needed if watching is persistent.
    //     //watcher.close();
    // };
    
}