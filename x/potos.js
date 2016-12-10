var fs = require('fs');
var u = require('./utils');

exports.pixcb = function (fsdir, path, cb) {
	console.log("potos:pixcb("+fsdir+"+"+path+")");
	fs.readdir(fsdir + path, 'utf8', function (err, files) {
		if (err) {
			console.log("ls ", err);
			throw new Error("ls error: "+err);
		}
		cb({
			count: files != null ? files.length : 0,
			files: files
		});
	});
};

exports.pix = function(fsdir, path) {
	return new Promise(function (resolve, reject) {
		console.log("potos:pixp("+fsdir+"+"+path+")");
		fs.readdir(fsdir + path, 'utf8', function (err, files) {
			if (err) reject(err);
			u.filterFiles(fsdir + path, files)
			.then(function (files) {
				resolve({
					count: files != null ? files.length : 0,
					files: files
				});
			});
		});
	});
};

/* files: [ {
	n: FILENAME,
	t: dir|img,
	mime: MIMETYPE
*/
