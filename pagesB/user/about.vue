<template>
	<view class="container">
		<view style="background-color: #eef3f7; padding:40px;">
			<u--image :showLoading="true" src="/static/logo_title.png" width="130px" height="45px" @click="click"
				customStyle="margin:auto"></u--image>
			<u--text text="开源物联网平台 Version1.3.1" size="14" type="info"
				customStyle="margin:auto; margin-top:20px;"></u--text>
			<u--text text="曲靖蜂信科技有限公司 | 官网: fastbee.cn" size="14" type="info"
				customStyle="margin:auto; margin-top:8px;"></u--text>
		</view>

		<view style="margin-top:20px;">
			<u-cell title="作者企鹅: 164770707" size="large">
				<u-icon slot="icon" size="20" name="qq-circle-fill" color="#3c9cff"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell>
			<u-cell title="作者微信: QQ164770707" size="large"><u-icon slot="icon" size="20" name="weixin-circle-fill"
					color="#5ac725"></u-icon></u-cell>
			<u-cell title="交流群: 946029159 , 1073236354" size="large">
				<u-icon slot="icon" size="20" name="qq-circle-fill" color="#3c9cff"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell>
			<u-cell isLink size="large">
				<u-link slot="title" href="http://fastbee.cn/" text="官方网站" color="#333"></u-link>
				<u-icon slot="icon" size="20" name="home-fill" color="#f56c6c"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell>
			<u-cell isLink size="large">
				<u-link slot="title" href="https://gitee.com/kerwincui/wumei-smart" text="查看源码" color="#333"></u-link>
				<u-icon slot="icon" size="20" name="github-circle-fill" color="#666"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell>
		</view>

		<view style="position:fixed;bottom:20px;left:0;right:0;">
			<u--text size="10" type="info" align="center"
				text="Copyright © 2022-2023 FastBee All Rights Reserved."></u--text>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {};
		},
		created () {},
		methods: {}
	};
</script>

<style>
	.container {
		padding-bottom: 100px;
	}
</style>