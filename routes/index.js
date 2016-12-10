var express = require('express');
var router = express.Router();
var potos = require('../x/potos');
var conf = require('../conf');
var path = require('path');
var u = require('../x/utils');

// ls with promise
router.get('/pix', function(req, res, next) {
	var query_path = path.normalize(req.query.path);
	var fsdir = path.normalize(__dirname + "/../public/" + conf.pixpath + "/");
	potos.pix(fsdir, query_path)
	.then(function (data) {
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
