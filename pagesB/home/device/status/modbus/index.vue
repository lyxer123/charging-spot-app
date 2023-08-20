<template>
	<page-meta>
		<navigation-bar :title="title" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="modbus-status-wrap">
		<u-sticky bgColor="#FFF" customStyle="border-bottom:1px solid #eee;">
			<u-tabs class="tabs-wrap" :list="tabsList" :scrollable="false" lineWidth="80" lineHeight="2" :duration="100"
				@click="handleTabsClick"></u-tabs>
		</u-sticky>
		<view class="attribute-report-wrap" v-if="tabsIndex === 0">
			<view class="cell-wrap">
				<u-cell v-for="(item,index) in runningstatusDatas" :key="index">
					<view slot="title" class="cell-title">
						<text class="cell-name">{{ item.name }}</text>
						<text class="cell-value"><text class="cell-value-num">{{ item.value }}</text>
							{{item.datatype.unit || item.datatype.unitName || ''}}</text>
						<text class="cell-time">时间：{{ item.ts || ''}}</text>
					</view>
				</u-cell>
			</view>
			<u-empty v-if="runningstatusDatas.length === 0" mode="list" marginTop="20"
				icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
		</view>
		<view class="service-issue-wrap" v-if="tabsIndex === 1">
			<view class="cell-wrap">
				<u-cell v-for="(item,index) in functionStatusData" :key="index">
					<view slot="title" class="cell-title">
						<text class="cell-name">{{ item.name }}</text>
						<view class="cell-value">
							<u--input customStyle="display: inline-block; width: 56px;padding: 0px; margin-right: 10px;"
								color="#0f73ee" border="bottom" type="number" v-model="item.value"></u--input>
							{{ item.datatype.unit || item.datatype.unitName || ''}}
						</view>
						<view class="cell-value-unit">
							数据范围：{{ item.datatype.max === null ? item.datatype.type === 'bool' ? 0 : "" : item.datatype.min }}
							~
							{{ item.datatype.max === null ? item.datatype.type === 'bool' ? 1 : "" : item.datatype.max }}
						</view>
						<text class="cell-time">时间：{{ item.ts || ''}}</text>
					</view>
					<view class="cell-val" slot="value">
						<u-button type="primary" size="mini" text="发送" @click="handelSendClick(item)"></u-button>
					</view>
				</u-cell>
			</view>
			<u-empty v-if="functionStatusData.length === 0" mode="list" marginTop="20"
				icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
		</view>
	</view>
</template>

<script>
	import { getDevice, getRunningStatus } from '@/apis/modules/device';
	import { postServiceInvoke } from '@/apis/modules/runtime.js';

	export default {
		data () {
			return {
				title: '运行状态',
				tabsIndex: 0,
				tabsList: [{ name: '属性上报' }, { name: '服务下发' }],
				deviceId: 0,
				slaveId: 0,
				productId: 0,
				serialNumber: '',
				subDeviceId: 0,
				runningstatusDatas: [],
				functionStatusData: []
			};
		},
		onLoad: function (option) {
			this.deviceId = Number(option.deviceId);
			this.slaveId = Number(option.slaveId);
			this.subDeviceId = Number(option.subDeviceId);
			this.getDevice();
			this.$bus.$on("updateDeviceStatus", (params) => {
				this.updateDeviceStatus(params);
			});
		},
		methods: {
			getDevice () {
				getDevice(this.subDeviceId).then(res => {
					const { data } = res;
					this.title = data.deviceName;
					const { serialNumber, productId } = data;
					this.productId = productId;
					this.serialNumber = serialNumber;
					this.getDeviceStatus(); // 获取运行状态数据
				}).catch(err => {
					console.log(err);
				});
			},
			// 单击选显卡
			handleTabsClick (item) {
				this.tabsIndex = item.index;
			},
			getDeviceStatus () {
				getRunningStatus(this.deviceId, this.slaveId, this.tabsIndex + 1, this.productId, this.serialNumber).then(
					res => {
						const { data } = res;
						this.runningstatusDatas = data.thingsModels;
						this.functionStatusData = data.thingsModels.filter(item => item.isReadonly == 0);
					}).catch(err => {
					console.log(err);
				})
			},
			// 更新设备状态数据
			updateDeviceStatus (msg) {
				if (msg.data) {
					msg.data.forEach(item => {
						this.runningstatusDatas.some((old, index) => {
							if (item.slaveId === old.slaveId && item.id == old.id) {
								const template = this.runningstatusDatas[index];
								template.ts = item.ts;
								template.value = item.value;
								this.$set(this.runningstatusDatas, index, template);
							}
						});
					});
				}
			},
			// 发送指令
			handelSendClick (item) {
				//判断输入是否超过范围
				if (item.datatype.max < item.value || item.datatype.min > item.value) {
					uni.showToast({
						icon: 'error',
						title: '请输入正确值！'
					})
					return;
				}
				console.log("send service:", item);
				const funVal = {
					[item.id]: item.value,
				}
				let serialNumber = String(this.serialNumber).split('_')[0];
				const data = {
					serialNumber: serialNumber,
					productId: this.productId,
					remoteCommand: funVal,
					identifier: item.id,
					slaveId: this.slaveId,
					modelName: item.name,
				}
				postServiceInvoke(data).then(response => {
					if (response.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '服务调用成功！'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.modbus-status-wrap {
		.tabs-wrap {
			width: 100%;
		}

		.attribute-report-wrap {}

		.service-issue-wrap {}

		.cell-wrap {
			padding: 5px 10px;

			.cell-title {
				.cell-name {
					display: block;
				}

				.cell-value {
					margin-top: 5px;
					display: block;

					.cell-value-num {
						margin-right: 3px;
						color: #0f73ee;
					}
				}

				.cell-value-unit {
					margin-top: 5px;
				}

				.cell-time {
					margin-top: 5px;
					display: block;
				}
			}
		}
	}
</style>