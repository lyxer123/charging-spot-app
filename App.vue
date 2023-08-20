<script>
import projectConfig from '@/env.config.js';
export default {
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {		
		console.log('App Show',);
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
	}
};
</script>

<style lang="scss">
@import '@/uni_modules/uview-ui/index.scss';
page {
	width: 100%;
	height: 100%;
	background-color: #eef3f7;
}
</style>
