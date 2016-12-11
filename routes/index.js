var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('lodash');
var conf = require('../conf');
var potos = require('../x/potos');
var u = require('../x/utils');
var qs = require('querystring');

router.get('/pix', function(req, res, next) {

	var public_conf = _.cloneDeep(conf.public);

	// &path=PATH from public/pix/
	var query_path = _.has(req.query, 'path') ? path.normalize(req.query.path) : '';
	var fsdir = path.normalize(__dirname + "/../public/" + conf.pixpath + "/");
	// &z=ZOOM in px
	var init_zoom = u.validateInt(req.query.z, 10, 1000);
	if (typeof init_zoom !== "undefined") public_conf.zoom = init_zoom;

	// query string without path
	var query_cp = _.clone(req.query);
	delete query_cp.path;
	var query_string = qs.stringify(query_cp);

	potos.pix(fsdir, query_path)
	.then(function (data) {
		data.querystring = query_string;
		data.conf = public_conf;
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
});

module.exports = router;
