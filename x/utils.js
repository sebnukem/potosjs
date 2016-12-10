var _ = require('lodash');

exports.prettyJson = prettyJson;
exports.detectMime = detectMime;
exports.isImage = isImage;
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
				console.log(err);
				reject(err);
			}
			console.log("detected "+filename+" mime type "+mime);
			if (!mime) reject('undefined');
			resolve(mime);
		});
	});
}

function isImage(filename) {
	console.log("u:isImage "+filename);
	return detectMime(filename)
	.then(function (mime) {
		return _.startsWith(mime, 'image');
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
		console.log('checkFile error', err);
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
				console.log('checkFile is back:',data);
				if (data) {
					console.log(filename+" is a "+data.t);
					images.push(data);
				}
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
