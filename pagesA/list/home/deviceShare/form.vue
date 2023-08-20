<template>
	<page-meta><navigation-bar title="用户详情" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<u--form labelPosition="left" :model="form" ref="form" labelWidth="80" labelAlign="center">
			<u-form-item label="用户名称:"><u--text type="info" :text="form.userName"></u--text></u-form-item>
			<u-form-item label="手机号码:"><u--text type="info" :text="form.phonenumber"></u--text></u-form-item>
			<u-form-item label="分享时间:"><u--text type="info" :text="form.createTime"></u--text></u-form-item>
			<u-form-item label="备注信息:"><u--textarea v-model="form.remark" placeholder="请输入内容" height="80"></u--textarea></u-form-item>

			<view style="margin-top:10px;display:flex;">
				<u-button type="error" @tap="handleDelete" size="small" customStyle="margin:10px;">删除</u-button>
				<u-button type="primary" @tap="submitForm" size="small" customStyle="margin:10px;">保存</u-button>
			</view>
		</u--form>
	</view>
</template>

<script>
import { getDeviceUser, delDeviceUser, updateDeviceUser } from '@/apis/modules/deviceUser';

export default {
	data() {
		return {
			// 表单参数
			form: {
				deviceId:0,
				userId:0,
				userName: null,
				phonenumber: null,
				createTime: null,
				remark: null
			}
		};
	},
	onLoad(option) {
		this.form.userName = option.userName;
		this.form.phonenumber = option.phonenumber;
		this.form.createTime = option.createTime;
		this.form.remark = option.remark;
		this.form.userId=option.userId;
		this.form.deviceId=option.deviceId;
	},
	methods: {
		// 删除
		handleDelete() {
			uni.showModal({
				title: '系统提示',
				content: '确定删除当前用户吗？',
				success: result => {
					if (result.confirm) {
						uni.showLoading({ title: '删除中...' });
						delDeviceUser(this.form)
							.then(res => {
								if (res) {
									uni.showToast({
										icon: 'success',
										title: res.msg
									});
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										});
									}, 1000);
									// 列表更新
									//this.getList();
								}
							})
							.finally(() => {
								uni.hideLoading();
							});
					}
				}
			});
		},
		submitForm() {
			updateDeviceUser(this.form).then(response => {
				uni.showToast({ icon: 'success', title: '修改成功' });
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 1000);
			});
		},
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style>
page {
	background: #eef3f7;
}
.container {
	background: #ffffff;
	padding: 20px;
}
</style>
