Vue.component('breadcrumbs', {
	template: '\
<span>\
<span v-if="is_photo">Image</span><span v-else>Album</span>\
<span v-for="(bc, i) in data">\
<span v-if="i"> &gt;</span> \
<a href="javascript:void(0)" @click="onBcClicked(bc.pp)">{{ bc.p }}</a></span>\
</span>',
	props: ['is_photo', 'data'],
	methods: {
		onBcClicked: function (e) {
			console.log('BC clicked', e);
			this.$emit('clicko', e);
		}
	}
});

Vue.component('img-thumbnail', {
	template: '\
<a href="javascript:void(0)" @click="onTnClicked(click_to)">\
<img v-if="file.t == \'img\'" :class="\'pic \'+file.t" :src="img_src" :title="filename+\' @ \'+img_src"/>\
<span v-if="file.t == \'dir\'" >{{ filename }}</span>\
</a>',
	props: ['data', 'file'],
	computed: {
		filename: function () { return this.file.n; },
		click_to: function () { return this.data.querypath + '/' + this.filename; },
		img_src: function () { return this.data.path + '/' + this.filename; }
	},
	methods: {
		onTnClicked: function (e) {
			console.log('TN clicked', e);
			this.$emit('clicko', e);
		}
	}
});

var app = new Vue({
	el: '#app',
	data: {
		conf: {
			zoom: POTOSJS.conf.zoom,
			pix_topdir: '/pix/'
		},
		show_json: true,
		title: 'potosjs',
		d: {
			querypath: POTOSJS.init.querypath ? POTOSJS.init.querypath : '/',
			count: 0,
			files: []
		}
	},
	computed: {
		wpath: function () {
			return this.conf.pix_topdir + this.d.querypath + '/';
		},
		xbreadcrumbs: function () {
			var bcs = [{p:'Home', pp:'/'}],
				acc = '';
			this.splitPath(this.d.querypath).forEach(function (p, i) {
				acc = acc + '/' + p;
				bcs.push({p:p, pp:acc});
			});
			return bcs;
		},
		is_photo: function () {
			return typeof this.d.file !== 'undefined';
		}
	},
	watch: {
	},
	methods: {
		splitPath: function (path) {
			return path.split('/').filter((e) => { return e.length > 0; });
		},
		onNewPath: function (path) {
			console.log("loading", path);
			var app = this;
			axios.get('/pix?fmt=json&path='+path)
			.then(function (resp) {
				app.d = resp.data; //_.assign(app, resp.data);
			}).catch(function (err) {
				console.error('ERROR', err);
			});
		},
		onPathClicked: function(e) {
			var href = typeof e === 'string' ? e : e.target.innerText;
			console.log("path clicked:", href);
			this.onNewPath(href);
		},
		onZoomClicked: function(by) {
			var app = this;
			function zoomBy(m) {
				var zoom = app.conf.zoom;
				zoom = Math.round(zoom * m);
				if (zoom < 10) zoom = 10;
				if (zoom > 1000) zoom = 1000;
				return zoom;
			};
			function resizePix(zoom) {
				console.log(`resizing thumbs to ${zoom}`);
				$('.pic').each(function () {
					$(this).css('maxWidth', zoom);
				});
				return zoom;
			}
			app.conf.zoom = resizePix(zoomBy(by));
		},
		onKeyup(e) {
			console.log("key pressed", e);
			if (e.keyCode === 173) { // -_ key
				this.onZoomClicked(0.9);
			}
			if (e.keyCode === 61) { // =+ key
				this.onZoomClicked(1.11);
			}
		}
	},
	created: function () {
		console.log('app ready');
		window.addEventListener('keyup', this.onKeyup);
		this.onNewPath(this.d.querypath);
	}
});
