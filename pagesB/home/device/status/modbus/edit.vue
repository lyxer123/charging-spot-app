<template>
	<view class="modbus-edit-wrap">
		<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
		<u--form labelPosition="left" :labelStyle="{marginRight:'10px'}" labelWidth="100" labelAlign="right"
			:model="model" :rules="rules" ref="form">
			<u-form-item label="设备名" prop="name" required borderBottom>
				<u--input v-model="model.name" border="none" clearable></u--input>
			</u-form-item>
			<u-form-item label="固件版本" prop="version" required borderBottom>
				<u--input v-model="model.version" type="number" border="none" clearable></u--input>
			</u-form-item>
		</u--form>
		<view class="edit-bottom-wrap">
			<view class="btn-wrap">
				<u-button type="primary" @click="handleSaveClick">保存</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { updateDevice } from '@/apis/modules/device';

	export default {
		data () {
			return {
				model: {
					name: '',
					version: '',
				},
				rules: {
					'name': {
						type: 'string',
						required: true,
						message: '请填写设备名',
						trigger: ['blur', 'change']
					},
					'version': {
						type: 'number',
						required: true,
						message: '请填写固件版本',
						trigger: ['blur', 'change']
					},
				},
				data: null
			};
		},
		onReady () {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.form.setRules(this.rules)
		},
		onLoad (option) {
			this.data = JSON.parse(decodeURIComponent(option.item));
			const { deviceName, firmwareVersion } = this.data;
			this.model.name = deviceName;
			this.model.version = firmwareVersion;
		},
		methods: {
			handleSaveClick () {
				this.$refs.form.validate().then(res => {
					this.updateDeviceData();
				}).catch(errors => {
					console.log('校验失败');
				})
			},
			updateDeviceData () {
				let device = {
					...this.data,
					deviceId: this.data.deviceId,
					deviceName: this.model.name,
					firmwareVersion: this.model.version
				};
				updateDevice(device).then(res => {
					if (res.code === 200) {
						uni.showToast({
							icon: 'success',
							title: '修改成功'
						});
						uni.navigateBack({
							delta: 1,
							success: (e) => {
								let pages = getCurrentPages();
								// #ifdef MP-WEIXIN
								let prePage = pages[pages.length - 1];
								//#endif
								// #ifdef H5 || APP-PLUS
								let prePage = pages[pages.length - 2];
								//#endif
								// 更新数据列表
								prePage.$vm.deviceForm.subDeviceList = [];
								prePage.$vm.getDevice();
							}
						});
					}
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	.modbus-edit-wrap {
		padding: 10px;

		/deep/ .u-form-item__body__left__content__required {
			left: 5px;
		}

		.edit-bottom-wrap {
			position: absolute;
			bottom: 50px;
			left: 0;
			right: 0;

			.btn-wrap {
				padding: 0 10px;
			}
		}
	}
</style>