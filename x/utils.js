var _ = require('lodash');

exports.prettyJson = prettyJson;
exports.detectMime = detectMime;
exports.isImage = isImage;
exports.filterImages = filterImages;

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
			if (!mime) reject('undefineds');
			resolve(mime);
		});
	});
};

function isImage(filename) {
	console.log("u:isImage "+filename);
	return detectMime(filename)
	.then(function (mime) {
		return _.startsWith(mime, 'image');
	});
};

function filterImages(fspath, filenames) {
	var images = [], pending;
	console.log("u:filterImages "+fspath+","+filenames+' "'+typeof filenames+'"');
	if (!filenames) return Promise.resolve([]);

	pending = filenames.length;
	return new Promise(function (resolve, reject) {
		filenames.forEach(function(filename, index) {
			isImage(fspath + "/" + filename)
			.then(function (isit) {
				if (isit) {
					console.log(filename+" is an image");
					images.push(filename);
				}
				pending--;
				if (pending === 0) resolve(images);
			});
		});
	});
};
