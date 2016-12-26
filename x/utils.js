'use strict';

var _ = require('lodash');
var qs = require('querystring');

exports.queryStringNoPath = queryStringNoPath;
exports.checkFile = checkFile;
exports.filterFiles = filterFiles;
exports.splitPath = splitPath;
exports.validateInt = validateInt;

function prettyJson(str, indent = 2) {
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
//	console.log(`u:detectMime ${filename}`);
	return new Promise(function (resolve, reject) {
		magic.detectFile(filename, function(err, mime) {
			if (err) {
				console.error("u:detectMime error", err);
				reject(err);
			}
			console.log(`mime ${filename} = ${mime}`);
			if (!mime) reject('undefined');
			resolve(mime);
		});
	});
}

function checkFilename(filename) {
	return !_.startsWith(filename, '.') && !_.startsWith(filename, '$');
}

function checkType(mime, check_type = '*') {
	var type = null;
	if (mime == 'inode/directory' || mime == 'inode/symlink') type = 'dir';
	else if (_.startsWith(mime, 'image')) type = 'img';
	if (check_type === '*' || check_type === type) return type;
	return null;
}

function checkFile(fspath, filename, check_type = '*') {
//	console.log(`u:checkFile ${filename}`);
	return Promise.resolve(filename)
	.then(() => {
		if (!checkFilename(filename)) throw filename;
	})
	.then(() => {
		return detectMime(`${fspath}/${filename}`);
	})
	.then((mime) => {
		var type = checkType(mime, check_type);
		if (type == null) throw filename;
		return {
			n: filename,
			mime: mime,
			t: type
		};
	})
	.catch(function (ex) {
		console.log('u:checkFile rejected', ex);
		return null;
	});
}

function filterFiles(fspath, filenames) {
	var images = [], pending;
	console.log(`u:filterFiles ${fspath}, ${filenames} "${typeof filenames}"`);
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
	return path.split('/').filter((e) => { return e.length > 0; });
}

function validateInt(q, min, max) {
	if (q == null) return null;
	var iq = parseInt(q, 10);
	if (+q !== iq) return null;
	if (typeof min !== 'undefined' && min != null && q < min) return null;
	if (typeof max !== 'undefined' && max != null && q > max) return null;
	return iq;
}

function validatePath(s) {
	if (s == null) return false;
	return /^[a-z0-9_/% ,.-]+$/i.test(s);
}
