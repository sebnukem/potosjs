var _ = require('lodash');
var qs = require('querystring');

exports.queryStringNoPath = queryStringNoPath;
exports.filterFiles = filterFiles;
exports.splitPath = splitPath;
exports.validateInt = validateInt;

function prettyJson(str, indent) {
	if (!indent) return str;
	var i = +indent;
	if (!(i > 0 && i < 9)) i = 2;
	return JSON.stringify(JSON.parse(str), null, i);
}

function queryStringNoPath(req_query) {
	var query_cp = _.clone(req_query);
	delete query_cp.path;
	return qs.stringify(query_cp);
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
			console.log('mime '+filename+' = '+mime);
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
		if (mime == 'inode/directory' || mime == 'inode/symlink') output.t = 'dir'
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

function splitPath(path) {
	return path.split('/').filter(function(e) { return e.length > 0; });
}

function validateInt(q, min, max) {
	if (q == null) return undefined;
	var iq = parseInt(q, 10);
	if (+q !== iq) return undefined;
	if (typeof min !== "undefined" && min != null && q < min) return undefined;
	if (typeof max !== "undefined" && max != null && q > max) return undefined;
	return iq;
}
