<template>
	<page-meta>
		<navigation-bar title="蜂信物联" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="container">
		<u-sticky bgColor="#FFF" customStyle="border-bottom:1px solid #eee;">
			<u-tabs :list="groupList" :scrollable="true" lineWidth="40" lineHeight="2" :duration="100"
				@change="groupChange">
				<view slot="right" style="padding: 0 10px 0 20px;" @tap="open">
					<u-icon name="plus" size="20" bold></u-icon>
				</view>
			</u-tabs>
		</u-sticky>

		<view class="wrapper">
			<view class="item" v-for="(device, mainIndex) in deviceList" :key="mainIndex">
				<view class="card" @tap="gotoDeviceDetail(device.deviceId)">
					<view v-if="device.status == 3 || device.isShadow == 1" class="title">
						<u--text lines="1" margin="0 0 0 10px" color="#fff" :text="device.deviceName"></u--text>
						<u-icon name="arrow-right" color="#fff" customStyle="margin-right:5px;" size="12"></u-icon>
					</view>
					<view v-else class="title title-info">
						<u--text lines="1" margin="0 0 0 10px" color="#fff" :text="device.deviceName"></u--text>
						<u-icon name="arrow-right" color="#fff" customStyle="margin-right:5px;" size="12"></u-icon>
					</view>
					<view class="equipment_info">
						<view class="info_title">
							<view class="title_left">
								<u--image v-if="device.imgUrl !== null && device.imgUrl !== ''" :src="device.imageUrl"
									radius="10" mode="aspectFill" width="70" height="60">
									<view slot="error" style="font-size: 12px;">加载失败</view>
									<template v-slot:loading>
										<u-loading-icon></u-loading-icon>
									</template>
								</u--image>
								<u--image v-else-if="device.deviceType === 2" src="/static/gateway.png" radius="10"
									mode="aspectFill" width="70" height="60">
								</u--image>
								<u--image v-else-if="device.deviceType === 3" src="/static/video.png" radius="10"
									mode="aspectFill" width="70" height="60">
								</u--image>
								<u--image v-else src="/static/device.png" radius="10" mode="aspectFill" width="70"
									height="60">
								</u--image>
							</view>
							<view style="padding-left:10px;">
								<view style="margin:10px 0 6px;">
									<u--text v-if="device.status == 3 && device.rssi >= '-55'" lines="1"
										prefixIcon="/static/wifi_4.png" iconStyle="margin-right:3px;" size="12"
										:text="statusTxt(device.status)"></u--text>
									<u--text
										v-else-if="device.status == 3 && device.rssi >= '-70' && device.rssi < '-55'"
										lines="1" prefixIcon="/static/wifi_3.png" iconStyle="margin-right:3px;"
										size="12" :text="statusTxt(device.status)"></u--text>
									<u--text
										v-else-if="device.status == 3 && device.rssi >= '-85' && device.rssi < '-70'"
										lines="1" prefixIcon="/static/wifi_2.png" iconStyle="margin-right:3px;"
										size="12" :text="statusTxt(device.status)"></u--text>
									<u--text
										v-else-if="device.status == 3 && device.rssi >= '-100' && device.rssi < '-85'"
										lines="1" prefixIcon="/static/wifi_1.png" iconStyle="margin-right:3px;"
										size="12" :text="statusTxt(device.status)"></u--text>
									<u--text v-else lines="1" prefixIcon="/static/wifi_0.png"
										iconStyle="margin-right:3px;" size="12" :text="statusTxt(device.status)">
									</u--text>
								</view>
								<view style="">
									<u--text lines="1" prefixIcon="/static/state_active.png"
										iconStyle="margin-right:3px;" size="12" v-if="device.isShadow == 1" text="影子">
									</u--text>
									<u--text lines="1" prefixIcon="/static/state.png" iconStyle="margin-right:3px;"
										size="12" v-else text="影子"></u--text>
								</view>
								<!-- <view style="margin:5px 0;">
									<u--text v-if="device.locationWay === 1" lines="1" size="12"
										class="status_item success" text="自动定位"></u--text>
									<u--text v-else-if="device.locationWay === 2" lines="1" size="12"
										class="status_item warning" text="设备定位"></u--text>
									<u--text v-else-if="device.locationWay === 3" lines="1" size="12"
										class="status_item primary" text="自定义位置"></u--text>
								</view> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-popup :show="show" @close="close" @open="open" mode="top" round="10">
			<view style="padding:20px 0 10px 0;">
				<u-grid :border="false" col="3">
					<u-grid-item>
						<u-icon name="/static/ap.png" size="25" color="#fff" label="配网添加" labelPos="bottom"
							labelSize="15" space="10px" @click="gotoAddDevice()"
							customStyle="background-color:#f56c6c;border-radius:3px;padding:10px;"></u-icon>
					</u-grid-item>
					<u-grid-item>
						<u-icon name="/static/scan.png" size="25" label="扫码添加" labelPos="bottom" labelSize="15"
							space="10px" @click="openScan"
							customStyle="background-color:#3c9cff;border-radius:3px;padding:10px;"></u-icon>
					</u-grid-item>
					<u-grid-item>
						<u-icon name="/static/relate.png" size="25" label="关联添加" labelPos="bottom" labelSize="15"
							space="10px" @click="gotoRelateDevice()"
							customStyle="background-color:#f9ae3d;border-radius:3px;padding:10px;"></u-icon>
					</u-grid-item>
				</u-grid>
				<view>
					<u-row>
						<u-col :span="4">
							<u--text type="info" text="适用于WIFI类型的设备" size="12" customStyle="padding:10px 15px;">
							</u--text>
						</u-col>
						<u-col :span="4">
							<u--text type="info" text="适用于蜂窝网络/以太网类设备" size="12" customStyle="padding:10px 15px;">
							</u--text>
						</u-col>
						<u-col :span="4">
							<u--text type="info" text="适用于蜂窝网络/以太网类设备,并支持批量操作" size="12"
								customStyle="padding:10px 15px;"></u--text>
						</u-col>
					</u-row>
				</view>
			</view>
		</u-popup>

		<u-modal :show="modal.show" :content="modal.content" @confirm="confirm" @cancel="cancel"
			:showConfirmButton="modal.showConfirmButton" showCancelButton></u-modal>
		<u-empty mode="list" :show="total == 0" marginTop="30"></u-empty>
		<u-loadmore :status="status" v-if="total > queryParams.pageSize" marginTop="20" />
		<u-loading-page :loading="loading" bg-color="#eef3f7" loadingText="FastBee.cn"></u-loading-page>
	</view>
</template>

<script>
	import { listDeviceShort, cacheJsonThingsModel } from '@/apis/modules/device';
	import { listGroup } from '@/apis/modules/group';
	import { deviceRelateUser } from '@/apis/modules/device';
	import projectConfig from '@/env.config.js';

	export default {
		data () {
			return {
				// 扫码模态窗
				modal: {
					show: false,
					showConfirmButton: false,
					content: ''
				},
				// 扫码获取的Json
				scanJson: {},
				// 顶部弹出层
				show: false,
				// 分组列表
				groupList: [],
				deviceList: [],
				// 加载更多
				status: 'nomore',
				loading: true,
				// 总条数
				total: 0,
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					deviceName: null,
					productName: null,
					groupId: 0
				}
			};
		},
		onShow () {
			// 配网后网络未初始化完成，获取列表会发生错误
			// let operate = getApp().globalData.operate;
			// if (operate && operate == 'operate') {
			// 	this.connectMqtt()
			// 	// 置空 operate
			// 	getApp().globalData.operate = '';
			// }
		},
		created () {
			if (this.profile == null) {
				this.getProfile();
			}
			this.connectMqtt();
		},
		methods: {
			/* 连接Mqtt消息服务器 */
			async connectMqtt () {
				if (this.$mqttTool.client == null) {
					await this.$mqttTool.connect(this.vuex_token);
				}
				this.mqttCallback();
				this.getList();
			},
			/* Mqtt回调处理  */
			mqttCallback () {
				this.$mqttTool.client.on('message', (topic, message, buffer) => {
					let topics = topic.split('/');
					let productId = topics[1];
					let deviceNum = topics[2];
					message = JSON.parse(message.toString());
					if (!message) {
						return;
					}
					if (topics[3] == 'status') {
						console.log('接收到【设备状态】主题：', topic);
						console.log('接收到【设备状态】内容：', message);
						// 更新列表中设备的状态
						for (let i = 0; i < this.deviceList.length; i++) {
							if (this.deviceList[i].serialNumber == deviceNum) {
								this.deviceList[i].status = message.status;
								this.deviceList[i].isShadow = message.isShadow;
								this.deviceList[i].rssi = message.rssi;
								return;
							}
						}
					}
				});
			},
			/* 订阅消息 */
			mqttSubscribe (list) {
				// 订阅当前页面设备状态和实时监测
				let topics = [];
				for (let i = 0; i < list.length; i++) {
					let topicStatus = '/' + list[i].productId + '/' + list[i].serialNumber + '/status/post';
					topics.push(topicStatus);
				}
				this.$mqttTool.subscribe(topics);
			},

			/* 发布消息 */
			mqttPublish (type, device, model) {
				let topic = '';
				let message = '';
				if (type == 1) {
					if (device.status == 3) {
						// 属性,在线模式
						topic = '/' + device.productId + '/' + device.serialNumber + '/property-online/get';
					} else if (device.isShadow) {
						// 属性,离线模式
						topic = '/' + device.productId + '/' + device.serialNumber + '/property-offline/post';
					}
					message = '[{"id":"' + model.id + '","value":"' + model.shadow + '"}]';
				} else if (type == 2) {
					if (device.status == 3) {
						// 功能,在线模式
						topic = '/' + device.productId + '/' + device.serialNumber + '/function-online/get';
					} else if (device.isShadow) {
						// 功能,离线模式
						topic = '/' + device.productId + '/' + device.serialNumber + '/function-offline/post';
					}
					message = '[{"id":"' + model.id + '","value":"' + model.shadow + '"}]';
				} else if (type == 3) {
					// OTA升级
					topic = '/' + device.productId + '/' + device.serialNumber + '/ota/get';
					message = '{"version":1.1}';
				} else {
					return;
				}
				if (topic != '') {
					// 发布
					this.$mqttTool.publish(topic, message, model.name);
				}
			},
			// 获取设备列表
			getList () {
				this.status = 'loadmore';
				this.getGroupList();
				listDeviceShort(this.queryParams).then(response => {
					response.rows = response.rows.map(item => {
						item.imageUrl = item.imgUrl !== null && item.imgUrl !== '' ? projectConfig
							.baseUrl + item.imgUrl : item.imgUrl;
						return item;
					});
					if (this.queryParams.pageNum == 1) {
						this.deviceList = response.rows;
					} else {
						this.deviceList = this.deviceList.concat(response.rows);
					}
					this.total = response.total;
					// 订阅消息
					if (this.deviceList && this.deviceList.length > 0) {
						this.mqttSubscribe(this.deviceList);
					}
					this.loading = false;
					uni.stopPullDownRefresh();
				});
			},
			// 获取分组列表
			getGroupList () {
				listGroup({
					userId: this.profile.userId
				}).then(response => {
					this.groupList = [{
						name: '全部',
						id: 0
					}];
					for (let i = 0; i < response.rows.length; i++) {
						this.groupList.push({
							name: response.rows[i].groupName,
							id: response.rows[i].groupId
						});
					}
				});
			},
			getProfile () {
				// 调用用户信息接口
				this.$api.common.getProfile().then(res => {
						//存储用户信息,TODO 需要调用一次，不然其他页面调用返回空
						uni.$u.vuex('profile', res.data);
						this.profile;
					})
					.catch(err => {
						this.$u.toast(err.msg);
					});
			},
			// 设备分组改变事件
			groupChange (item) {
				this.queryParams.groupId = item.id;
				this.queryParams.pageNum = 1;
				this.getList();
			},
			// 设备状态
			statusTxt (status) {
				let txt = '';
				switch (status) {
					case 1:
						txt = '未激活';
						break;
					case 2:
						txt = '禁用';
						break;
					case 3:
						txt = '在线';
						break;
					case 4:
						txt = '离线';
						break;
				}
				return txt;
			},
			// 跳转详情
			gotoDeviceDetail (deviceId) {
				uni.navigateTo({
					url: '/pagesA/home/device/index?deviceId=' + deviceId
				});
			},
			// 添加设备
			gotoAddDevice () {
				this.show = false;
				uni.navigateTo({
					url: '/pagesA/list/home/deviceAdd'
				});
			},
			// 关联设备
			gotoRelateDevice () {
				this.show = false;
				uni.navigateTo({
					url: '/pagesA/list/home/deviceRelate'
				});
			},
			// 打开顶部弹窗
			open () {
				this.show = true;
			},
			// 关闭顶部弹窗
			close () {
				this.show = false;
			},
			// 下拉刷新
			onPullDownRefresh () {
				this.list = [];
				this.queryParams.pageNum = 1;
				// Http获取列表
				this.getList();
				this.getGroupList();
			},
			// 上拉加载
			onReachBottom () {
				this.status = 'loading';
				this.queryParams.pageNum = this.queryParams.pageNum + 1;
				if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize > this.total) {
					this.status = 'nomore';
				} else {
					this.getList();
				}
			},
			/***************************************扫码关联设备***********************************************/
			// 模态窗确定
			confirm () {
				this.cancel();
				let form = {
					deviceNumberAndProductIds: [{
						deviceNumber: this.scanJson.deviceNumber,
						productId: this.scanJson.productId
					}],
					userId: this.profile.userId
				};
				deviceRelateUser(form).then(res => {
					if (res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '保存成功'
						});
						this.show = false;
					} else {
						this.modal = {
							show: true,
							showConfirmButton: false,
							content: '发生错误：' + res.msg
						};
					}
				});
			},
			// 模态窗取消
			cancel () {
				this.modal = {
					show: false,
					showConfirmButton: false,
					content: ''
				};
			},
			// 扫码
			openScan () {
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
							this.scanJson = JSON.parse(res.result);
							// type=1 代表扫码关联设备
							if (this.scanJson.type == 1) {
								this.modal = {
									show: true,
									showConfirmButton: true,
									content: '【设备编号:' + this.scanJson.deviceNumber + ', 产品名称:' + this
										.scanJson.productName + '】确定添加吗？'
								};
								return;
							}
							uni.showToast({
								icon: 'none',
								title: '解析二维码后，找不到对应处理类型'
							});
						} catch (error) {
							uni.showToast({
								icon: 'none',
								title: '解析二维码错误，格式不正确'
							});
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
		padding-bottom: 100px;
	}

	.wrapper {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.wrapper .item {
		width: 50%;
	}

	.wrapper .item .card {
		box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		margin: 10px;
		padding: 10px;
		background-color: #ffffff;
		height: 90px;

		.equipment_info {
			margin-top: 10px;

			.info_title {
				display: flex;
				flex-direction: row;
				margin-top: 8px;

			}

			.info_end {
				font-size: 12px;
				margin-top: 8px;

				.status_item {
					position: relative;
					align-items: center;
					margin-top: 5px;
					text-align: center;
					padding: 0 0.5rem;

					&:first-child {
						padding-left: 0;
					}

					&:last-child {
						padding-right: 0;
					}

					&:not(:last-child)::after {
						position: absolute;
						top: 3px;
						right: 0px;
						bottom: 0px;
						left: auto;
						border-width: 2px;
						border-right: 2px solid #abd1f7;
						content: "";
					}

					&.primary {
						color: #3c9cff;
					}

					&.warning {
						color: #f9ae3d;
					}

					&.danger {
						color: #f56c6c;
					}

					&.success {
						color: #5ac725;
					}

					&.info {
						color: #909399;
					}
				}
			}
		}
	}

	.wrapper .item .title {
		background-color: #3c9cff;
		padding: 3px 0;
		margin: 0 -10px;
		margin-top: -10px;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
		display: flex;
	}

	.wrapper .item .title-info {
		background-color: #abd1f7;
	}

	/* 下拉框 */
	/deep/ .uni-select {
		padding: 2px !important;
		font-size: 12px !important;
		height: 24px !important;
	}

	/deep/ .uni-select__selector {
		white-space: nowrap !important;
		left: -30px !important;
		width: auto !important;
	}

	/deep/ .uni-select__input-box {
		overflow: hidden !important;
	}
</style>