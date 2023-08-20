<template>
	<view>
		<u-swipe-action>
			<u-swipe-action-item :options="swipeOptions" v-for="(item, i) in deviceInfo.subDeviceList" :key="i"
				@click="handleEditClick(item)">
				<view class="modbus-wrap u-border-top u-border-bottom"
					@click="gotoDeviceDetail(deviceInfo.deviceId, item.slaveId, item.deviceId)">
					<view class="modbus-content">
						<u-cell>
							<view slot="title" class="u-slot-title">
								<text class="cell-title">{{item.deviceName}}</text>
								<view class="cell-ver">
									<u-tag borderColor="transparent" :text="`ver ${item.firmwareVersion}`" plain
										size="mini" type="warning">
									</u-tag>
								</view>
							</view>
							<view class="cell-val" slot="value">
								<u--text :type="item.statusInfo.type" :text="item.statusInfo.name"></u--text>
							</view>
							<view class="cell-label" slot="label">{{item.serialNumber}}</view>
						</u-cell>
					</view>
				</view>
			</u-swipe-action-item>
		</u-swipe-action>
	</view>
</template>

<script>
	import { getDeviceStatusInfo } from '@/helpers/common.js'

	export default {
		name: 'modbus-status',
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
				this.deviceInfo.subDeviceList = this.formatSubDeviceList(newVal.subDeviceList);
			}
		},
		data () {
			return {
				// swipe选项配置
				swipeOptions: [{
					text: '编辑',
					style: {
						backgroundColor: '#3c9cff'
					}
				}],
				// 设备数据
				deviceInfo: {
					subDeviceList: [],
				}
			};
		},
		created () {
			// 获取设备状态(兼容H5和APP)
			if (this.device.subDeviceList) {
				this.deviceInfo = this.device;
				this.deviceInfo.subDeviceList = this.formatSubDeviceList(this.device.subDeviceList);
			}
		},
		methods: {
			// 获取子设备状态信息
			formatSubDeviceList (data) {
				if (data && data.length !== 0) {
					return data.map(item => {
						item.statusInfo = getDeviceStatusInfo(item.status);
						return item;
					})
				}
			},
			// 跳转详情
			gotoDeviceDetail (deviceId, slaveId, subDeviceId) {
				uni.navigateTo({
					url: `/pagesB/home/device/status/modbus/index?deviceId=${deviceId}&slaveId=${slaveId}&subDeviceId=${subDeviceId}`
				});
			},
			// 编辑子设备
			handleEditClick (item) {
				uni.navigateTo({
					url: `/pagesB/home/device/status/modbus/edit?item=${encodeURIComponent(JSON.stringify(item))}`
				});
			}
		}
	}
</script>

<style lang="scss">
	.modbus-wrap {
		.modbus-content {

			.cell-title {
				font-size: 16px;
			}

			.cell-ver {
				display: inline-block;
				margin-left: 5px;
			}

			.cell-label {
				margin-top: 5px;
				font-size: 12px;
				color: #909193;
				line-height: 18px;
			}

			.cell-val {
				text-align: right;
				font-size: 14px;
				line-height: 24px;
				color: #606266;
			}
		}
	}
</style>