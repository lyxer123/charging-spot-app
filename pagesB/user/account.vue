<template>
	<page-meta><navigation-bar title="账号" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<u--image src="/static/avatar.png" shape="square" radius="10" width="50" height="50"></u--image>
		<u-line></u-line>
		<u--form labelPosition="left">
			<u-form-item label="用户名称 :" labelWidth="85"><u--text :text="profile.userName"
					type="info"></u--text></u-form-item>
			<u-form-item label="用户昵称 :" labelWidth="85"><u--text :text="profile.nickName"
					type="info"></u--text></u-form-item>
			<u-form-item label="电子邮箱 :" labelWidth="85"><u--text :text="profile.email"
					type="info"></u--text></u-form-item>
			<u-form-item label="电话号码 :" labelWidth="85"><u--text :text="profile.phonenumber"
					type="info"></u--text></u-form-item>
			<u-form-item label="创建时间 :" labelWidth="85"><u--text :text="profile.createTime"
					type="info"></u--text></u-form-item>
			<u-form-item label="登录IP :" labelWidth="85"><u--text :text="profile.loginIp"
					type="info"></u--text></u-form-item>
			<u-form-item label="备注信息 :" labelWidth="85"><u--text :text="profile.remark==null?'无':profile.remark"
					type="info"></u--text></u-form-item>
		</u--form>
		<view style="margin-top:10px;"><u-button type="primary" text="确定" @click="goBack()"></u-button></view>
	</view>
</template>

<script>
	export default {
		data () {
			return {

			};
		},
		created () {
			if (this.profile == null) {
				this.getProfile();
			}
		},
		methods: {
			goBack () {
				uni.navigateBack({
					delta: 1
				});
			},
			getProfile () {
				// 调用用户信息接口
				this.$api.common.getProfile().then(res => {
					//存储用户信息,TODO 需要调用一次，不然其他页面调用返回空
					uni.$u.vuex('profile', res.data);
					this.profile;
				}).catch(err => {
					this.$u.toast(err.msg);
				});
			},
		}
	};
</script>

<style>
	.container {
		padding: 20px;
		padding-bottom: 100px;
	}
</style>