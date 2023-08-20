<template>
	<view>
		<base-status v-if="!isSubDev" :device="device" ref="baseStatus"></base-status>
		<modbus-status v-if="isSubDev" :device="device"></modbus-status>
	</view>
</template>

<script>
	import baseStatus from './base.vue';
	import modbusStatus from './modbus.vue';

	export default {
		name: 'running-status',
		components: {
			baseStatus,
			modbusStatus
		},
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
				this.isSubDev = newVal.subDeviceList && newVal.subDeviceList.length > 0;
			}
		},
		data () {
			return {
				isSubDev: false,
				deviceInfo: {} // 设备信息
			};
		},
		created () {
			// 获取设备状态(兼容H5和APP)
			if (this.device.subDeviceList) {
				this.deviceInfo = this.device;
				this.isSubDev = this.device.subDeviceList.length > 0;
			}
		},
		methods: {
			baseStatusRefresh () {
				this.$refs.baseStatus.deviceStatusRefresh();
			}
		}
	};
</script>

<style>
</style>