var express = require('express');
var router = express.Router();
var potos = require('../x/potos');
var conf = require('../conf');

var pixpath = '';
router.init = function (data) {
	pixpath = data;
};

// /* GET home page. */
// router.get('/', function(req, res, next) {
// 	res.render('index', { title: 'Express' });
// });

// // ls with callback
// router.get('/pixcb', function(req, res, next) {
// 	potos.pixcb(__dirname + "/../public/" + conf.pixpath + "/", req.query.path, function (data) {
// 		data.querypath = req.query.path;
// 		data.path = conf.pixpath + "/" + req.query.path;
// 		if (req.query.fmt === 'json')
// 			res.json(data);
// 		res.render('pix', data);
// 	});
// });

// ls with promise
router.get('/pix', function(req, res, next) {
	potos.pix(__dirname + "/../public/" + conf.pixpath + "/", req.query.path)
	.then(function (data) {
		data.querypath = req.query.path;
		data.path = "/" + conf.pixpath + "/" + req.query.path;
		console.log("/pix data", data);
		if (req.query.fmt === 'json')
			res.json(data);
		else
			res.render('pix', data);
	})
//	.then(res.json)
//	.catch(function (err) { return "err"; });
	.catch(next);
});


module.exports = router;
