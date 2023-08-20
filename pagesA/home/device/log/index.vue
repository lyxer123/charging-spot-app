<template>
	<view class="log-wrap">
		<u-cell-group>
			<u-cell icon="file-text" title="事件日志" :isLink="true" size="large" @click="handleEventLogClick"></u-cell>
			<u-cell icon="bookmark" title="指令日志" :isLink="true" size="large" @click="handleOrderLogClick"></u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		name: 'device-log',
		props: {
			device: {
				type: Object,
				default: null,
				required: true
			}
		},
		watch: {
			// 兼容小程序
			device: function (newVal, oldVal) {
				this.deviceInfo = newVal;
				this.deviceId = newVal.deviceId;
				this.serialNumber = newVal.serialNumber;
				this.productId = newVal.productId;
			}
		},
		data () {
			return {
				deviceId: 0,
				serialNumber: '',
				productId: '',
				thingsModel: {}, // 物模型
				deviceInfo: {} // 设备信息
			};
		},
		created () {
			// 获取设备状态(兼容H5和APP)
			if (this.device.serialNumber) {
				this.deviceInfo = this.device;
				this.deviceId = this.device.deviceId;
				this.serialNumber = this.device.serialNumber;
				this.productId = this.device.productId;
			}
		},
		methods: {
			handleEventLogClick () {
				uni.navigateTo({
					url: `/pagesB/home/device/log/event?serialNumber=${this.serialNumber}&productId=${this.productId}`
				});
			},
			handleOrderLogClick () {
				uni.navigateTo({
					url: `/pagesB/home/device/log/order?deviceId=${this.deviceId}&serialNumber=${this.serialNumber}`
				});
			}
		}
	};
</script>

<style lang="scss">
	.log-wrap {
		background: #ffffff;
	}
</style>