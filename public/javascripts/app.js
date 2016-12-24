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
			console.log('TN onClicked', e);
			this.$emit('clicko', e);
		}
	}
});

var app = new Vue({
	el: '#app',
	data: {
		conf: {
			pix_topdir: '/pix/'
		},
		title: 'potosjs',
		d: {
			querypath: '/',
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
		traceData: function () {
			console.log(this.$data);
		},
		splitPath: function (path) {
			return path.split('/').filter((e) => { return e.length > 0; });
		},
		onNewPath: function (path) {
			var app = this;
			axios.get('/pix?fmt=json&path='+path)
			.then(function (resp) {
				var data = resp.data;
				//_.assign(app, data);
				app.d = data;
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
