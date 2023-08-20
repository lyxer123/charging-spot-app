<template>
	<view class="container">
		<view class="top">
			<u--image src="/static/logo-1.png" width="200" height="60" customStyle="margin:0 auto;"></u--image>
		</view>

		<view class="main">
			<u--text size="18" type="info" bold margin="10px 0" text="账号登录"></u--text>
			<u--form :model="loginForm" :rules="rules" ref="form">
				<u-form-item prop="username" borderBottom>
					<u--input v-model="loginForm.username" clearable border="none" placeholder="请输入用户名"
						prefixIcon="account-fill" prefixIconStyle="font-size: 22px;color: #909399"
						:clearable="true"></u--input>
				</u-form-item>
				<u-form-item prop="password" borderBottom>
					<u--input v-model="loginForm.password" type="password" clearable border="none" placeholder="请输入密码"
						prefixIcon="lock-fill" prefixIconStyle="font-size: 22px;color: #909399"
						:clearable="true"></u--input>
				</u-form-item>
				<u-form-item prop="code" borderBottom>
					<!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
					<u-input placeholder="请输入验证码" v-model="loginForm.code" border="none" prefixIcon="integral-fill"
						prefixIconStyle="font-size: 22px;color: #909399">
						<template slot="suffix">
							<u--image :src="codeUrl" width="120px" height="30px" @click="getCode"></u--image>
						</template>
					</u-input>
				</u-form-item>
				<view style="margin-top:20px;"><u-button type="primary" text="登录" @click="login()"></u-button></view>
				<view style="margin-top:10px;display:none;"><u-button type="success" text="微信登录"></u-button></view>
			</u--form>
			<view class="register-wrap">
				<view><u--text lines="1" text="演示账号: fastbee 123456" type="info"></u--text></view>
				<view class="now-btn"><u--text text="现在注册" type="primary" @click="register"></u--text></view>
			</view>

			<view class="footer">
				<view class="clause">
					<checkbox-group @change="handleClauseCheckbox">
						<label>
							<checkbox :checked="isClause" style="transform:scale(0.6)" />
						</label>
						<text class="check_text">
							<text>已阅读并同意</text>
							<text class="service" @click="handleService">服务协议</text>
							<text>与</text>
							<text class="privacy" @click="handlePrivacy">隐私政策</text>
						</text>
					</checkbox-group>
				</view>
				<view class="copyright"><text>Copyright © 2022-2023 FastBee All Rights Reserved.</text></view>
			</view>
		</view>

		<u-modal :show="show" :content="content" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import projectConfig from '@/env.config.js';
	import {
		getProfile
	} from '@/apis/modules/common.js'

	export default {
		data () {
			return {
				// 提示窗
				show: false,
				content: '',
				backButtonPress: 0,
				token: '',
				codeUrl: '',
				isClause: false,
				loginForm: {
					username: 'fastbee',
					password: '123456',
					rememberMe: false,
					code: '',
					uuid: ''
				},
				rules: {
					username: {
						type: 'string',
						min: 2,
						max: 20,
						required: true,
						message: '请输入用户名',
						trigger: ['blur', 'change']
					},
					password: {
						type: 'string',
						required: true,
						min: 5,
						max: 20,
						message: '请输入密码',
						trigger: ['blur', 'change']
					},
					code: {
						type: 'integer',
						required: true,
						message: '请输入验证码',
						trigger: ['blur', 'change']
					}
				}
			};
		},
		mounted () {
			this.getToken();
			if (this.token != '' && this.token != null) {
				// 跳转主页
				uni.switchTab({
					url: '/pages/tabBar/home/home'
				});
			} else {
				this.getCode();
				this.getAccount();
			}
		},
		onBackPress (options) {
			this.backButtonPress++;
			if (this.backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function () {
				this.backButtonPress = 0;
			}, 1000);
			return true;
		},
		methods: {
			login () {
				this.$refs.form.validate().then(res => {
					if (!this.isClause) {
						uni.showToast({
							icon: 'none',
							title: '请阅读并勾选协议'
						});
						return;
					}
					// 调用登录接口
					this.$api.common.login(this.loginForm).then(async res => {
						if (res.code == 200) {
							// 存储token和账号
							this.saveToken(res.token);
							this.saveAccount();
							// 获取用户信息
							let profile = await this.getProfile();
							uni.$u.vuex('profile', profile);
							// 跳转主页
							uni.switchTab({
								url: '/pages/tabBar/home/home'
							});
						} else {
							this.getCode();
							this.content = res.msg;
							this.show = true;
						}
					})
				}).catch(errors => {
					uni.$u.toast('账号信息不能为空');
				});
			},
			// 获取验证码
			getCode () {
				this.$api.common
					.captchaImage()
					.then(res => {
						this.codeUrl = 'data:image/gif;base64,' + res.img;
						this.loginForm.uuid = res.uuid;
						this.loginForm.code = "";
					})
					.catch(err => {
						this.$u.toast(err.msg);
					});
			},
			// 提示框确认
			confirm () {
				this.show = false;
			},
			// 用户注册
			register () {
				uni.$u.route('/pages/register');
			},
			// 获取用户信息
			getProfile () {
				return new Promise((resolve, reject) => {
					getProfile().then(res => {
						resolve(res.data);
					}).catch(err => {
						this.$u.toast(err.msg);
					})
				});
			},
			saveToken (token) {
				// 本地缓存存储token
				uni.setStorageSync('token', token);
				// vuex存储token
				uni.$u.vuex('vuex_token', token);
			},
			getToken () {
				// 本地缓存获取token
				this.token = uni.getStorageSync('token');
				// vuex存储token
				uni.$u.vuex('vuex_token', this.token);
			},
			saveAccount () {
				// 本地缓存存储
				uni.setStorageSync('username', this.loginForm.username);
				uni.setStorageSync('password', this.loginForm.password);
			},
			getAccount () {
				// 本地缓存获取
				let username = uni.getStorageSync('username');
				let password = uni.getStorageSync('password');
				if (username && username != '') {
					this.loginForm.username = username;
				}
				if (password && password != '') {
					this.loginForm.password = password;
				}
			},
			// 服务协议
			handleService () {
				let title = '服务协议';
				let url = projectConfig.officialWebUrl + 'service-agreement.html';
				uni.navigateTo({
					url: `/pages/common/webview/index?title=${title}&url=${url}`
				});
			},
			// 隐私政策
			handlePrivacy () {
				let title = '隐私政策';
				let url = projectConfig.officialWebUrl + 'privacy-policy.html';
				uni.navigateTo({
					url: `/pages/common/webview/index?title=${title}&url=${url}`
				})
			},
			// 勾选协议
			handleClauseCheckbox (e) {
				this.isClause = !this.isClause;
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #007aff;
		/* background: linear-gradient(310deg, #007aff 60%,#FBC2EB 100%); */
	}

	.top {
		padding-top: 90px;
		height: 210px;
	}

	.main {
		position: fixed;
		padding: 20px;
		background: #ffffff;
		border-top-left-radius: 0px;
		border-top-right-radius: 0px;
		top: 210px;
		left: 0;
		right: 0;
		bottom: 0;

		.register-wrap {
			margin-top: 15px;
			display: flex;

			.now-btn {
				margin-left: 10px;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 20px;
		left: 0;
		right: 0;
		color: #909399;
		text-align: center;

		.copyright {
			font-size: 8px;
			margin-top: 10px;
		}

		.clause {
			font-size: 14px;

			.check_text {
				display: inline-block;
				vertical-align: middle;
			}

			.service,
			.privacy {
				color: #3c9cff;
			}
		}
	}
</style>