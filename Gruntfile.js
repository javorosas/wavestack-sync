module.exports = function (grunt) {
	grunt.initConfig({
		nodewebkit: {
			options: {
			    build_dir: './webkitbuilds', // Where the build version of my node-webkit app is saved
			    mac: true,
			    win: true,
			    linux32: true,
			    linux64: true,
			    mac_icns: './src/img/icon.icns'
			},
			src: ['./src/**/*'] // Your node-webkit app
		},
	})
	grunt.loadNpmTasks('grunt-node-webkit-builder');
	grunt.registerTask('default', 'nodewebkit');
};
