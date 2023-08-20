<template>
	<page-meta><navigation-bar title="关联设备" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<u--form labelWidth="70" labelAlign="left">
			<view class="card" v-for="(item, index) in form.deviceNumberAndProductIds" :key="index">
				<view style="display:flex;justify-content: flex-start;">
					<u-button type="error" text="删除" icon="minus-circle" size="small" customStyle="width:70px;margin:0;" v-if="index != 0" @click="removeDeviceNumber(index)"></u-button>
					<u-button type="primary" text="添加" icon="plus-circle" size="small" customStyle="width:70px;margin:0;" v-if="index == 0" @click="addDeviceNumber"></u-button>
					<u-button
						type="success"
						text="扫码识别"
						icon="scan"
						size="small"
						customStyle="margin-left:20px;width:90px;"
						@click="openScan(form.deviceNumberAndProductIds[index])"
					></u-button>
				</view>
				<u-form-item label="设备编号"><u-input v-model="form.deviceNumberAndProductIds[index].deviceNumber" placeholder="请输入设备编号"></u-input></u-form-item>
				<u-form-item label="产品编号"><u-input v-model="form.deviceNumberAndProductIds[index].productId" placeholder="请输入产品编号"></u-input></u-form-item>
				<u-form-item label="产品名称"><u-input v-model="form.deviceNumberAndProductIds[index].productName" disabled placeholder="产品名称可不填"></u-input></u-form-item>
			</view>
		</u--form>

		<view class="card">
			<view style="display:flex;">
				<u-button type="warning" @click="goBack" customStyle="margin:10px;">返回</u-button>
				<u-button type="primary" @click="submitForm" customStyle="margin:10px;">保存</u-button>
			</view>
		</view>

		<u-modal :show="modal.show" :content="modal.content" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
import { deviceRelateUser } from '@/apis/modules/device';
export default {
	data() {
		return {
			// 模态窗
			modal: {
				show: false,
				content: ''
			},
			// 表单内容
			form: {
				deviceNumberAndProductIds: [
					{
						deviceNumber: '',
						productId: null,
						productName: ''
					}
				],
				userId: null
			}
		};
	},
	created() {
		//获取登录用户信息
		if (this.profile == null) {
			this.getProfile();
		} else {
			this.form.userId = this.profile.userId;
		}
	},
	onUnload() {},
	methods: {
		// 获取登录用户信息
		getProfile() {
			// 调用用户信息接口
			this.$api.common
				.getProfile()
				.then(res => {
					//存储用户信息,TODO 需要调用一次，不然其他页面调用返回空
					uni.$u.vuex('profile', res.data);
					this.profile;
					this.form.userId = this.profile.userId;
				})
				.catch(err => {
					this.$u.toast(err.msg);
				});
		},
		// 添加一项
		addDeviceNumber() {
			this.form.deviceNumberAndProductIds.push({ deviceNumber: '', productId: null, productName: '' });
		},
		// 移除一项
		removeDeviceNumber(index) {
			this.form.deviceNumberAndProductIds.splice(index, 1);
		},
		// 返回
		goBack() {
			getApp().globalData.operate = 'operate';
			uni.navigateBack({
				delta: 1
			});
		},
		// 模态窗取消
		confirm() {
			this.modal = {
				show: false,
				content: ''
			};
		},
		// 全部保存
		submitForm() {
			if (this.form.userId == null || this.form.userId == 0) {
				uni.showToast({ icon: 'none', title: '用户名不能未空' });
				return;
			}
			for (let i = 0; i < this.form.deviceNumberAndProductIds.length; i++) {
				if (this.form.deviceNumberAndProductIds[i].deviceNumber == '') {
					uni.showToast({ icon: 'none', title: '设备编号不能为空' });
					return;
				}
				if (this.form.deviceNumberAndProductIds[i].productId == null || this.form.deviceNumberAndProductIds[i].productId == 0) {
					uni.showToast({ icon: 'none', title: '产品ID不能为空' });
					return;
				}
			}
			deviceRelateUser(this.form).then(res => {
				if (res.code == 200) {
					uni.showToast({ icon: 'success', title: '保存成功' });
					setTimeout(() => {
						this.goBack();
					}, 1000);
				} else {
					this.modal = {
						show: true,
						content: '发生错误：' + res.msg
					};
				}
			});
		},
		// 扫码
		openScan(item) {
			// #ifndef MP-WEIXIN || APP-PLUS
			uni.showToast({
				icon: 'none',
				title: '扫码只支持App和小程序'
			});
			return;
			// #endif

			// 允许从相机和相册扫码
			uni.scanCode({
				success: res => {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
					if (res.result.substr(0, 1) != '{') {
						console.log('坑点：解析二维码后第一个位置包含一个特殊字符，大部分编译器和调试工具识别不了这个特殊字符');
						res.result = res.result.substring(1);
					}
					// 解析JSON
					try {
						let json = JSON.parse(res.result);
						// type=1 代表扫码关联设备
						if (json.type == 1) {
							item.deviceNumber = json.deviceNumber;
							item.productId = json.productId;
							item.productName = json.productName;
							return;
						}
						uni.showToast({ icon: 'none', title: '解析二维码，格式不正确' });
					} catch (error) {
						uni.showToast({ icon: 'none', title: '解析二维码，格式不正确' });
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #eef3f7;
}
.container {
	padding-bottom: 50px;
}
.card {
	box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
	border-radius: 6px;
	background-color: #fff;
	margin: 10px;
	padding: 10px;
}
</style>
