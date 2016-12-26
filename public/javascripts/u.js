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
POTOSJS.ls = {
	set: function(k, v) {
		if (typeof Storage === "undefined") return null;
		var kk = POTOSJS.conf.ls_prefix + k;
		localStorage.setItem(kk, v);
		console.log(`ls stored ${kk}=${v}`);
	},
	get: function(k, d) {
		if (typeof Storage === "undefined") return d;
		var kk = POTOSJS.conf.ls_prefix + k;
		var v = localStorage.getItem(kk);
		console.log(`ls retrieved ${kk}=${v} | ${d}`);
		if (v == null) return d;
		return v;
	}
};
