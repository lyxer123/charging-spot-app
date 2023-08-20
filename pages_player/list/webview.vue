<template>
	<view class="webview">
		<web-view :src="url" id="webcon" @message="handleMessage">
		</web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				device_id: '',
				accessToken: ''
			}
		},
		onLoad(options) {
			this.device_id = options.device_id
			this.accessToken = options.accessToken
      //uniapp小程序
			this.url = "https://wx.test.com/wechat?device_id=" + this.device_id + "&accessToken=" + this.accessToken
      //uniapp App
      this.url = "/static/h5.html?device_id=" + this.device_id + "&accessToken=" + this.accessToken
			//设置 webview 界面的状态栏的 title
			uni.setNavigationBarTitle({
				title: '监控详情'
			});
		},

	}
</script>

<style>
	.webview {
		width: 100vw;
		height: 100vh;
	}
</style>
