var _ = require('lodash');

//exports.prettyJson = prettyJson;
//exports.detectMime = detectMime;
//exports.isImage = isImage;
exports.filterFiles = filterFiles;

function prettyJson(str, indent) {
	if (!indent) return str;
	var i = +indent;
	if (!(i > 0 && i < 9)) i = 2;
	return JSON.stringify(JSON.parse(str), null, i);
}

var mmmagic = require('mmmagic');
var magic = new mmmagic.Magic(mmmagic.MAGIC_MIME_TYPE);

function detectMime(filename) {
	console.log("u:detectMime "+filename);
	return new Promise(function (resolve, reject) {
		magic.detectFile(filename, function(err, mime) {
			if (err) {
				console.log("u:detectMime error", err);
				reject(err);
			}
			if (!mime) reject('undefined');
			resolve(mime);
		});
	});
}

function checkFilename(filename) {
	console.log("u:checkFilename "+filename);
	return new Promise(function (resolve, reject) {
		if (_.startsWith(filename, '.') || _.startsWith(filename, '$')) reject(filename);
		resolve(filename);
	});
}

function checkFile(fspath, filename) {
	console.log("u:checkFile "+filename);
	return Promise.resolve(filename)
	.then(checkFilename)
	.then(function () {
		return detectMime(fspath+'/'+filename)
	})
	.then(function (mime) {
		var output = {
			n: filename,
			mime: mime
		};
		if (mime == 'inode/directory') output.t = 'dir'
		else if (_.startsWith(mime, 'image')) output.t = 'img'
		else return null;
		return output;
	})
	.catch(function (err) {
		console.log('u:checkFile error', err);
		return null;
	});
}

function filterFiles(fspath, filenames) {
	var images = [], pending;
	console.log("u:filterFiles "+fspath+","+filenames+' "'+typeof filenames+'"');
	if (!filenames) return Promise.resolve([]);

	pending = filenames.length;
	return new Promise(function (resolve, reject) {
		filenames.forEach(function(filename, index) {
			checkFile(fspath, filename)
			.then(function (data) {
				if (data) images.push(data);
				pending--;
				if (pending === 0) resolve(images);
			})
			.catch(function (err) {
				pending--;
				if (pending === 0) resolve(images);
			});
		});
	});
}
