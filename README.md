wavestack-sync
==============

## What?
[Wavestack](https://www.wavestack.com) is a cloud service for professional music creators that allows them to keep track of their work and to collaborate with another musicians around the world.

This is an app for syncing your project files to Wavestack. It is developed with the use of the [node-webkit](https://github.com/rogerwang/node-webkit) project.

As it's name implies, a *sync app* is an application that makes an integral copy of a folder on every device on which it is running. It tracks file changes and compare them with a reference on the cloud, by consuming an API (in this case, Wavestack's API).

## Why?

Most professional audio producers work with [DAW's](http://en.wikipedia.org/wiki/Digital_audio_workstation) that run on computers with desktop environments (mainly Mac/OSX). The most practical and user-friendly way of uploading files to the cloud and keep them up to date, so far, is using a *sync app*.

node-webkit provides a way of writing an app **once** and compile for the three main OS's: Mac OSX, Windows and Linux, which perfectly fits the need for a multiplatform app, reducing development and maintenance time exponentially.

## Development roadmap

### Ready
	[x] Write README

### To-do
	[ ] Create the *Wavestack folder* in the user's directory.
	[ ] Show the tray icon.
	[ ] Log in.
	[ ] Implementations of syncable tasks (download, upload, rename).
	[ ] Perform a manual sync on startup (compare the local and remote sync dates).
	[ ] Monitor the Wavestack folder and run sync tasks when something changes.
	[ ] Check updates on server with polling.
	[ ] When user disconnects, copy the Wavestack folder to /user_path/Wavestack_<username>.

## Contributing?
* Read about
	* [node-webkit](https://github.com/rogerwang/node-webkit).
	* [The official Wavestack API](http://docs.wavestack.apiary.io).
* Any inquiries or insights, please contact me at [javo@wavestack.com](mailto:javo@wavestack.com).