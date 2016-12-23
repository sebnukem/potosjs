
var app = new Vue({
	el: '#app',
	data: {
		conf: {
			pix_topdir: '/pix/'
		},
		title: 'potosjs',
		querypath: '/',
		count: 0,
		files: []
	},
	computed: {
		wpath: function () { return this.conf.pix_topdir + this.querypath + '/'; },
		xbreadcrumbs: function () {
			var bcs = [{p:'Home', pp:'/'}],
				acc = '';
			this.splitPath(this.querypath).forEach(function (p, i) {
				acc = acc + '/' + p;
				bcs.push({p:p, pp:acc});
			});
			return bcs;
		}
	},
	watch: {
	},
	methods: {
		traceData: function () {
			console.log(this);
		},
		splitPath: function (path) {
			return path.split('/').filter((e) => { return e.length > 0; });
		},
		onNewPath: function(qpath) {
			var app = this;
			axios.get('/pix?fmt=json&path='+qpath)
			.then(function (resp) {
				var data = resp.data;
				_.assign(app, data);
			}).catch(function (err) {
				console.error('ERROR', err);
			});
		},
		onPathClicked: function(e) {
			var href = typeof e === 'string' ? e : e.target.innerText;
			console.log("path clicked:", href);
			this.onNewPath(href);
		}
	}
});
