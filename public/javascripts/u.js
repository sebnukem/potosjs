'use strict';

var POTOSJS = POTOSJS || {
	conf: {
		zoom: 50
	},
	init: {
		querypath: '/'
	}
};

// init localstorage
POTOSJS.conf.ls_prefix = 'potosjs.';
POTOSJS.ls = (function () {
	var prefix = POTOSJS.conf.ls_prefix;
	return typeof Storage !== "undefined" ? {
		set: function(k, v) {
			var kk = prefix + k;
			localStorage.setItem(kk, v);
			console.log(`ls stored ${kk}=${v}`);
		},
		get: function(k, d = null) {
			var kk = prefix + k;
			var v = localStorage.getItem(kk);
			console.log(`ls retrieved ${kk}=${v} | ${d}`);
			if (v == null) return d;
			return v;
		}
	} : { // localStorage is not available
		set: function (k, v) { return null; },
		get: function (k, d = null) { return d; }
	};
})();

// split path
POTOSJS.splitPath = function (path) {
	return path.split('/').filter((e) => { return e.length > 0; });
};
