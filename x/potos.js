'use strict';

var fs = require('fs');
var path = require('path');
var u = require('./utils');

exports.pix = function(fsdir, query_path) {
	return new Promise(function (resolve, reject) {
		console.log(`potos:pix(${fsdir} + ${query_path})`);
		fs.readdir(fsdir + query_path, 'utf8', function (err, files) {
			if (err) reject(err);
			u.filterFiles(fsdir + query_path, files)
			.then(function (files) {
				resolve({
					count: files != null ? files.length : 0,
					files: files
				});
			});
		});
	});
};

exports.pic = function(fsdir, query_path) {
	return new Promise(function (resolve, reject) {
		console.log(`potos:pic(${fsdir} + ${query_path})`);
		var path_data = path.parse(fsdir + query_path);
		u.checkFile(path_data.dir, path_data.base, 'img')
		.then(function (data) {
			resolve(data);
		})
	});
};

/* files: [ {
	n: FILENAME,
	t: dir|img,
	mime: MIMETYPE
*/
