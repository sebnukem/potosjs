'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var conf = require('../conf');
var potos = require('../x/potos');
var u = require('../x/utils');

router.get('/', function(req, res, next) {

	var init_zoom = u.validateInt(req.query.z, 10, 1000); // &z=ZOOM in px

	res.render('index', {
		initzoom: init_zoom == null ? 0 : init_zoom,
		querypath: _.has(req.query, 'path') ? path.normalize(req.query.path) : ''
	});
});

router.get('/pix', function(req, res, next) {

	var public_conf = _.cloneDeep(conf.public);

	// &path=PATH from public/pix/
	var query_path = _.has(req.query, 'path') ? path.normalize(req.query.path) : '';
	var fsdir = path.normalize(__dirname + "/../public/" + conf.pixpath + "/");
	var is_file = fs.lstatSync(fsdir + query_path).isFile();
	console.log(`${query_path} is file = ${is_file}`);

	if (!is_file) { // album
		// &z=ZOOM in px
		let init_zoom = u.validateInt(req.query.z, 10, 1000);
		if (typeof init_zoom !== "undefined") public_conf.zoom = init_zoom;

		potos.pix(fsdir, query_path)
		.then(function (data) {
			data.conf = public_conf;
			data.querystring = u.queryStringNoPath(req.query);
			data.querypath = query_path;
			data.path = path.normalize("/" + conf.pixpath + "/" + query_path);
			data.breadcrumbs = u.splitPath(query_path);
			console.log("/pix data", data);

			if (req.query.fmt === 'json')
				res.json(data);
			else
				res.render('pix', data);
		})
		.catch(next);
	}
	else { // photo
		potos.pic(fsdir, query_path)
		.then(function (data) {
			data.file = {
				n: data.n,
				t: data.t,
				mime: data.mime
			};
			data.conf = public_conf;
			data.querystring = u.queryStringNoPath(req.query);
			data.querypath = query_path;
			data.path = path.normalize("/" + conf.pixpath + "/" + query_path);
			data.breadcrumbs = u.splitPath(query_path);
			console.log("/pic data", data);

			if (req.query.fmt === 'json')
				res.json(data);
			else
				res.render('pic', data);
		})
		.catch(next);
	}
});

module.exports = router;
