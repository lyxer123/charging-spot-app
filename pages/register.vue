<template>
	<view class="container">
		<view class="main">
			<u--form :model="registerForm" :rules="rules" ref="form">
				<u-form-item prop="username" borderBottom>
					<u--input
						v-model="registerForm.username"
						clearable
						border="none"
						placeholder="请输入用户名"
						prefixIcon="account-fill"
						prefixIconStyle="font-size: 22px;color: #909399"
					></u--input>
				</u-form-item>
				<u-form-item prop="phonenumber" borderBottom>
					<u--input
						v-model="registerForm.phonenumber"
						clearable
						border="none"
						placeholder="请输入手机号码"
						prefixIcon="phone-fill"
						prefixIconStyle="font-size: 22px;color: #909399"
					></u--input>
				</u-form-item>
				<u-form-item prop="password" borderBottom>
					<u--input
						v-model="registerForm.password"
						type="password"
						clearable
						border="none"
						placeholder="请输入密码"
						prefixIcon="lock-fill"
						prefixIconStyle="font-size: 22px;color: #909399"
					></u--input>
				</u-form-item>
				<u-form-item prop="confirmPassword" borderBottom>
					<u--input
						v-model="registerForm.confirmPassword"
						type="password"
						clearable
						border="none"
						placeholder="请再次输入密码"
						prefixIcon="lock-fill"
						prefixIconStyle="font-size: 22px;color: #909399"
					></u--input>
				</u-form-item>
				<u-form-item prop="code" borderBottom>
					<!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
					<u-input placeholder="请输入验证码" v-model="registerForm.code" border="none" prefixIcon="integral-fill" prefixIconStyle="font-size: 22px;color: #909399">
						<template slot="suffix">
							<u--image :src="codeUrl" width="120px" height="30px" @click="getCode"></u--image>
						</template>
					</u-input>
				</u-form-item>
				<view style="margin-top:20px;"><u-button type="primary" text="注 册" @click="handleRegister()"></u-button></view>
			</u--form>
			<view style="margin-top:10px;display: flex;"><u--text text="已有账号登录" type="primary" customStyle="flex:auto" @click="gotoLogin"></u--text></view>
			<view class="copyright"><u--text size="8" type="info" align="center" text="Copyright © 2022-2023 wumei smart All Rights Reserved."></u--text></view>
		</view>

		<u-modal :show="show" :content="content" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
import { captchaImage, register } from '@/apis/modules/common.js';
export default {
	data() {
		return {
			// 提示窗
			show: false,
			content: '',
			resultCode:500,
			codeUrl: '',
			registerForm: {
				username: '',
				phonenumber: '',
				password: '',
				confirmPassword: '',
				code: '',
				uuid: '',
				bindId: ''
			},
			rules: {
				username: {
					type: 'string',
					min: 4,
					max: 20,
					required: true,
					message: '请输入用户名,长度大于4',
					trigger: ['blur', 'change']
				},
				phonenumber: [
					{
						type: 'integer',
						min: 11,
						max: 11,
						required: true,
						message: '请输入手机号码',
						trigger: ['blur', 'change']
					},
					{
						validator: (rule, value, callback) => {
							return uni.$u.test.mobile(value);
						},
						message: '手机号码格式不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					}
				],
				password: {
					type: 'string',
					required: true,
					min: 5,
					max: 20,
					message: '请输入密码且长度大于5',
					trigger: ['blur', 'change']
				},
				confirmPassword: [
					{
						type: 'string',
						required: true,
						message: '请输入密码',
						trigger: ['blur', 'change']
					},
					{
						validator: (rule, value, callback) => {
							if (this.registerForm.password !== value) {
								// uni.$u.test.mobile()就是返回true或者false的
								return false;
							} else {
								return true;
							}
						},
						message: '两次输入的密码不一致',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					}
				],
				code: {
					type: 'integer',
					required: true,
					message: '请输入验证码',
					trigger: ['blur', 'change']
				}
			}
		};
	},
	created() {
		this.getCode();
	},
	methods: {
		// 用户注册
		handleRegister() {
			this.$refs.form
				.validate()
				.then(res => {
					// 调用登录接口
					register(this.registerForm)
						.then(res => {
							this.innerRegister(res);
						}).catch(err=>{
							console.log("err catch",err);
						})
				})
		},
		// 注册
		innerRegister(res) {
			this.resultCode=res.code;
			if(res.code==200){
				this.content = "恭喜你，您的账号 " + this.registerForm.username + " 注册成功！";
			}else{
				this.content = res.msg; 
			}
			this.show = true;
		},
		// 提示框确认
		confirm() {
			this.show = false;
			if(this.resultCode==200){
				uni.$u.route({ url: '/pages/login', type: 'redirect' });
			}else{
				this.getCode();
			}
		},
		// 获取验证码
		getCode() {
			this.$api.common
				.captchaImage()
				.then(res => {
					this.codeUrl = 'data:image/gif;base64,' + res.img;
					this.registerForm.uuid = res.uuid;
					this.loginForm.code="";
				})
		},
		// 已有账号登录
		gotoLogin() {
			uni.$u.route({ url: '/pages/login', type: 'redirect' });
		},

	}
};
</script>

<style>
.main {
	padding: 20px;
	background: #ffffff;
	border-top-left-radius: 0px;
	border-top-right-radius: 0px;
}
.copyright {
	position: fixed;
	bottom: 20px;
	left: 0;
	right: 0;
}
</style>
