<template>
	<page-meta>
		<navigation-bar :title="title" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="container">
		<!-- 设备 -->
		<view v-show="tabbarIndex === 0 && deviceForm.deviceType !== 3">
			<u-sticky bgColor="#FFF" customStyle="border-bottom:1px solid #eee;">
				<u-tabs :list="tabList" :scrollable="false" lineWidth="80" lineHeight="2" :duration="100"
					@click="tabClick"></u-tabs>
			</u-sticky>
			<!-- 设备运行状态 -->
			<running-status v-show="tabIndex == 0" :device="deviceForm" ref="runningStatus"></running-status>
			<!-- 设备实时监测 -->
			<device-monitor v-show="tabIndex == 1" :show="tabIndex == 1" :device="deviceForm"
				:productId="deviceForm.productId" :serialNumber="deviceForm.serialNumber" ref="deviceMonitor">
			</device-monitor>
			<view v-show="tabIndex === 2">
				<u--form labelPosition="left" :model="deviceForm" :rules="deviceRules" ref="deviceForm" labelWidth="90"
					labelAlign="center">
					<view class="card">
						<view class="card-title-wrap">
							<u--text prefixIcon="grid-fill" iconStyle="font-size: 16px;color:#606266" text="基本信息" bold
								color="#606266"></u--text>
						</view>
						<u-form-item label="设备名称" prop="deviceName">
							<u--input v-model="deviceForm.deviceName"></u--input>
						</u-form-item>
						<u-form-item label="定位方式" prop="locationWay" v-if="deviceForm.deviceType !== 3">
							<uni-data-select v-model="deviceForm.locationWay" :localdata="locationList" :clear="false">
							</uni-data-select>
						</u-form-item>
						<u-form-item label="设备经度" v-if="deviceForm.locationWay === 3">
							<u--input v-model="deviceForm.longitude" type="digit" placeholder="请输入设备经度"></u--input>
						</u-form-item>
						<u-form-item label="设备纬度" v-if="deviceForm.locationWay === 3">
							<u--input v-model="deviceForm.latitude" type="digit" placeholder="请输入设备纬度"></u--input>
						</u-form-item>
						<u-form-item label="所在地址" v-if="deviceForm.locationWay === 3">
							<u--input v-model="deviceForm.networkAddress"></u--input>
						</u-form-item>
						<u-form-item label="设备影子">
							<u-switch v-model="deviceForm.isShadow" activeColor="#3c9cff" :inactiveValue="0"
								:activeValue="1" customStyle="border-radius:3px;" size="24"></u-switch>
						</u-form-item>
						<u-form-item label="禁用设备">
							<u-switch v-model="deviceDisable" activeColor="#f56c6c" :inactiveValue="0" :activeValue="1"
								customStyle="border-radius:3px;" size="24"></u-switch>
						</u-form-item>
						<u-form-item label="备注信息">
							<u-textarea v-model="deviceForm.remark" height="40" fontSize="14" placeholder="请输入内容"
								confirmType="done"></u-textarea>
						</u-form-item>
						<view style="margin-top:10px;display:flex;">
							<u-button type="success" @tap="gotoShare" size="small"
								customStyle="margin:10px;">分享</u-button>
							<u-button type="primary" @tap="submitForm" size="small"
								customStyle="margin:10px;">保存</u-button>
						</view>
					</view>

					<view class="card">
						<view style="margin:10px;">
							<u--image :src="imageUrl" radius="10" mode="aspectFill" width="100%" height="200">
								<view slot="error" style="font-size: 18rpx;">加载失败</view>
								<template v-slot:loading>
									<u-loading-icon></u-loading-icon>
								</template>
							</u--image>
						</view>

						<u-form-item label="设备状态">
							<u-button text="未激活" type="warning" size="mini" plain v-if="deviceForm.status == 1"
								customStyle="width:50px;margin:0;"></u-button>
							<u-button text="禁用" type="error" size="mini" plain v-if="deviceForm.status == 2"
								customStyle="width:50px;margin:0;"></u-button>
							<u-button text="在线" type="success" size="mini" plain v-if="deviceForm.status == 3"
								customStyle="width:50px;margin:0;"></u-button>
							<u-button text="离线" type="info" size="mini" plain v-if="deviceForm.status == 4"
								customStyle="width:50px;margin:0;"></u-button>
						</u-form-item>

						<u-form-item label="设备编号">
							<u--text :text="deviceForm.serialNumber"></u--text>
						</u-form-item>
						<u-form-item label="所属产品">
							<u--text :text="deviceForm.productName"></u--text>
						</u-form-item>
						<u-form-item label="固件版本">
							<u--text :text="formatVersion(deviceForm.firmwareVersion)"></u--text>
						</u-form-item>
						<u-form-item label="定位方式" v-if="deviceForm.deviceType === 3">
							<u--text :text="deviceForm.locationWayInfo.name"></u--text>
						</u-form-item>
						<u-form-item label="设备经度" v-if="deviceForm.longitude && deviceForm.locationWay !== 3">
							<u--text :text="deviceForm.longitude"></u--text>
						</u-form-item>
						<u-form-item label="设备纬度" v-if="deviceForm.latitude && deviceForm.locationWay !== 3">
							<u--text :text="deviceForm.latitude"></u--text>
						</u-form-item>
						<u-form-item label="设备信号">
							<u--text text="极好" type="success" v-if="deviceForm.rssi >= '-55'"></u--text>
							<u--text text="优" type="success"
								v-else-if="deviceForm.rssi >= '-70' && deviceForm.rssi < '-55'"></u--text>
							<u--text text="良" type="success"
								v-else-if="deviceForm.rssi >= '-85' && deviceForm.rssi < '-70'"></u--text>
							<u--text text="中" type="warning"
								v-else-if="deviceForm.rssi >= '-100' && deviceForm.rssi < '-85'"></u--text>
							<u--text text="差" type="error" v-else></u--text>
						</u-form-item>
						<u-form-item label="所在地址" v-if="deviceForm.networkAddress && deviceForm.locationWay !== 3">
							<u--text :text="deviceForm.networkAddress"></u--text>
						</u-form-item>
						<u-form-item label="入网地址">
							<u--text :text="deviceForm.networkIp"></u--text>
						</u-form-item>
						<u-form-item label="激活时间">
							<u--text :text="deviceForm.activeTime"></u--text>
						</u-form-item>

						<view style="margin-top:10px;display:flex;">
							<u-modal :show="show" :title="modalTitle" :content="content" showCancelButton
								@confirm="confirm" @cancel="cancel"></u-modal>
							<u-button type="error" @click="handleDelete" size="small"
								customStyle="margin:10px;">删除设备</u-button>
							<!-- 暂时不使用 -->
							<!-- <u-button type="primary" @click="deviceSynchronization" size="small"
								customStyle="margin:10px;">数据同步</u-button> -->
						</view>
					</view>
				</u--form>
			</view>
		</view>

		<!-- 视频监控设备 -->
		<view v-show="tabbarIndex === 0 && deviceForm.deviceType === 3">
			<u-sticky bgColor="#FFF" customStyle="border-bottom:1px solid #eee;">
				<u-tabs :list="tabList" :scrollable="false" lineWidth="80" lineHeight="2" :duration="100"
					@click="tabClick"></u-tabs>
			</u-sticky>
			<!-- 设备通道 -->
			<view class="channel_wrap" v-show="tabIndex == 0">
				<view class="item_body" v-for="(item, i) in channelList" :key="i"
					@click="gotoDevicePlayer(item.deviceSipId, item.channelSipId, item.status)">
					<view class="img">
						<u-icon name="play-circle" color="#2979ff" size="28"></u-icon>
					</view>
					<view>
						<u--text lines="2" lineHeight="24" size="16" :text="item.channelName"></u--text>
						<view style="display:flex;margin-top:6px;">
							<view style="margin-right:20px;">
								<u--text prefixIcon="info-circle"
									iconStyle="color:#606266;font-size:14px;margin-right:3px;" size="12" color="#606266"
									mode="name" :text="item.model"></u--text>
							</view>
						</view>
						<view class="status">
							<u-tag v-if="item.statusInfo" :type="item.statusInfo.type" :plain="true" size="mini"
								:text="item.statusInfo.name"></u-tag>
						</view>
					</view>
				</view>
				<u-empty mode="list" :show="channelTotal === 0" marginTop="30"></u-empty>
				<u-loadmore :status="channelLoadStatus" v-if="channelTotal > channelQueryParams.pageSize"
					marginTop="20" />
			</view>
			<view v-show="tabIndex === 1">
				<u--form labelPosition="left" :model="deviceForm" :rules="deviceRules" ref="deviceForm" labelWidth="90"
					labelAlign="center">
					<view class="card">
						<view class="card-title-wrap">
							<u--text prefixIcon="grid-fill" iconStyle="font-size: 16px;color:#606266" text="基本信息" bold
								color="#606266"></u--text>
						</view>
						<u-form-item label="设备名称" prop="deviceName">
							<u--input v-model="deviceForm.deviceName"></u--input>
						</u-form-item>
						<u-form-item label="定位方式" prop="locationWay" v-if="deviceForm.deviceType !== 3">
							<uni-data-select v-model="deviceForm.locationWay" :localdata="locationList" :clear="false">
							</uni-data-select>
						</u-form-item>
						<u-form-item label="设备经度" v-if="deviceForm.locationWay === 3">
							<u--input v-model="deviceForm.longitude" type="digit" placeholder="请输入设备经度"></u--input>
						</u-form-item>
						<u-form-item label="设备纬度" v-if="deviceForm.locationWay === 3">
							<u--input v-model="deviceForm.latitude" type="digit" placeholder="请输入设备纬度"></u--input>
						</u-form-item>
						<u-form-item label="所在地址" v-if="deviceForm.locationWay === 3">
							<u--input v-model="deviceForm.networkAddress"></u--input>
						</u-form-item>
						<u-form-item label="备注信息">
							<u-textarea v-model="deviceForm.remark" height="40" fontSize="14" placeholder="请输入内容"
								confirmType="done"></u-textarea>
						</u-form-item>
						<view style="margin-top:10px;display:flex;">
							<u-button type="success" @tap="gotoShare" size="small"
								customStyle="margin:10px;">分享</u-button>
							<u-button type="primary" @tap="submitForm" size="small"
								customStyle="margin:10px;">保存</u-button>
						</view>
					</view>

					<view class="card">
						<view style="margin:10px;">
							<u--image :src="imageUrl" radius="10" mode="aspectFill" width="100%" height="200">
								<view slot="error" style="font-size: 18rpx;">加载失败</view>
								<template v-slot:loading>
									<u-loading-icon></u-loading-icon>
								</template>
							</u--image>
						</view>

						<u-form-item label="设备状态">
							<u-button text="未激活" type="warning" size="mini" plain v-if="deviceForm.status == 1"
								customStyle="width:50px;margin:0;"></u-button>
							<u-button text="禁用" type="error" size="mini" plain v-if="deviceForm.status == 2"
								customStyle="width:50px;margin:0;"></u-button>
							<u-button text="在线" type="success" size="mini" plain v-if="deviceForm.status == 3"
								customStyle="width:50px;margin:0;"></u-button>
							<u-button text="离线" type="info" size="mini" plain v-if="deviceForm.status == 4"
								customStyle="width:50px;margin:0;"></u-button>
						</u-form-item>

						<u-form-item label="设备编号">
							<u--text :text="deviceForm.serialNumber"></u--text>
						</u-form-item>
						<u-form-item label="所属产品">
							<u--text :text="deviceForm.productName"></u--text>
						</u-form-item>
						<u-form-item label="固件版本">
							<u--text :text="formatVersion(deviceForm.firmwareVersion)"></u--text>
						</u-form-item>
						<u-form-item label="定位方式" v-if="deviceForm.deviceType === 3">
							<u--text :text="deviceForm.locationWayInfo.name"></u--text>
						</u-form-item>
						<u-form-item label="设备经度" v-if="deviceForm.longitude && deviceForm.locationWay !== 3">
							<u--text :text="deviceForm.longitude"></u--text>
						</u-form-item>
						<u-form-item label="设备纬度" v-if="deviceForm.latitude && deviceForm.locationWay !== 3">
							<u--text :text="deviceForm.latitude"></u--text>
						</u-form-item>
						<u-form-item label="设备信号">
							<u--text text="极好" type="success" v-if="deviceForm.rssi >= '-55'"></u--text>
							<u--text text="优" type="success"
								v-else-if="deviceForm.rssi >= '-70' && deviceForm.rssi < '-55'"></u--text>
							<u--text text="良" type="success"
								v-else-if="deviceForm.rssi >= '-85' && deviceForm.rssi < '-70'"></u--text>
							<u--text text="中" type="warning"
								v-else-if="deviceForm.rssi >= '-100' && deviceForm.rssi < '-85'"></u--text>
							<u--text text="差" type="error" v-else></u--text>
						</u-form-item>
						<u-form-item label="所在地址" v-if="deviceForm.networkAddress && deviceForm.locationWay !== 3">
							<u--text :text="deviceForm.networkAddress"></u--text>
						</u-form-item>
						<u-form-item label="入网地址">
							<u--text :text="deviceForm.networkIp"></u--text>
						</u-form-item>
						<u-form-item label="激活时间">
							<u--text :text="deviceForm.activeTime"></u--text>
						</u-form-item>

						<view style="margin-top:10px;display:flex;">
							<u-modal :show="show" :title="modalTitle" :content="content" showCancelButton
								@confirm="confirm" @cancel="cancel"></u-modal>
							<u-button type="error" @click="handleDelete" size="small"
								customStyle="margin:10px;">删除设备</u-button>
						</view>
					</view>
				</u--form>
			</view>
		</view>

		<!-- 设备定时 -->
		<device-timer v-show="tabbarIndex == 1" :device="deviceForm" ref="deviceTimer" gotoDeviceDetail></device-timer>
		<!-- 设备日志 -->
		<device-log v-show="tabbarIndex === 2" :device="deviceForm"></device-log>
		<!-- 设备统计 -->
		<device-statistic v-show="tabbarIndex === 3" :show="tabbarIndex == 3" :device="deviceForm" ref="deviceStatistic"
			gotoDeviceDetail></device-statistic>

		<u-tabbar :value="tabbarIndex" @change="tabbarChange" :fixed="true" :placeholder="true"
			:safeAreaInsetBottom="true" :border="false" v-if="deviceForm.deviceType !==3">
			<u-tabbar-item text="设备" @click="tabbarClick(0)">
				<image style="width:15px;height:15px;" slot="active-icon" src="/static/device_blue.png"></image>
				<image style="width:15px;height:15px;" slot="inactive-icon" src="/static/device_black.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="定时" @click="tabbarClick(1)">
				<image style="width:15px;height:15px;" slot="active-icon" src="/static/time_blue.png"></image>
				<image style="width:15px;height:15px;" slot="inactive-icon" src="/static/time_black.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="日志" @click="tabbarClick(2)">
				<image style="width:15px;height:15px;" slot="active-icon" src="/static/log_blue.png"></image>
				<image style="width:15px;height:15px;" slot="inactive-icon" src="/static/log_black.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="统计" @click="tabbarClick(3)">
				<image style="width:15px;height:15px;" slot="active-icon" src="/static/statistic_blue.png"></image>
				<image style="width:15px;height:15px;" slot="inactive-icon" src="/static/statistic_black.png"></image>
			</u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	import {
		getDevice,
		getRunningStatus,
		cacheJsonThingsModel,
		deviceSynchronization,
		updateDevice,
		delDevice
	} from '@/apis/modules/device';
	import runningStatus from './status/index.vue';
	import deviceLog from './log/index.vue';
	import deviceStatistic from './statistic/index.vue';
	import deviceMonitor from './monitor/index.vue';
	import deviceTimer from './timer/index.vue';
	import { listChannel } from '@/apis/modules/sip';
	import { getSipStatusInfo, getLocationWayInfo } from '@/helpers/common.js'
	import projectConfig from '@/env.config.js';

	export default {
		components: {
			runningStatus,
			deviceLog,
			deviceStatistic,
			deviceMonitor,
			deviceTimer
		},
		data () {
			return {
				title: '设备',
				deviceId: 0,
				tabIndex: 0,
				tabbarIndex: 0,
				tabList: [{
					name: '运行状态'
				}, {
					name: '实时监测'
				}, {
					name: '设备详情'
				}],
				show: false, // 删除设备模态框
				modalTitle: '删除警告', // 对话框标题
				content: '', // 对话框内容
				deviceForm: {
					deviceName: '',
					locationWay: 1
				}, // 设备详情
				deviceDisable: 0, // 设备状态（1=禁用，0=不禁用）
				isSubDev: false, // 是否有子设备
				imageUrl: '', // 图片地址
				locationList: [{ // 定位方式
					value: 1,
					text: '自动定位'
				}, {
					value: 2,
					text: '设备定位'
				}, {
					value: 3,
					text: '自定义位置'
				}],
				deviceRules: { // 表单校验
					deviceName: [{
						required: true,
						message: '设备名称不能为空',
						trigger: ['blur', 'change']
					}]
				},
				// 设备通道
				channelLoadStatus: 'nomore',
				channelQueryParams: {
					pageNum: 1,
					pageSize: 10,
					deviceSipId: '',
				},
				channelTotal: 0,
				channelList: [],
			};
		},
		onLoad: function (option) {
			this.deviceId = Number(option.deviceId);
			this.connectMqtt(); // 连接mqtt
		},
		onUnload () {
			this.mqttUnSubscribe(this.deviceForm); // 取消订阅主题
		},
		onShow () {
			let operate = getApp().globalData.operate;
			if (operate && operate == 'timer') {
				this.$refs.deviceTimer.deviceTimerRefresh();
				getApp().globalData.operate = ''; // 置空 operate
			}
		},
		methods: {
			/* 连接Mqtt消息服务器 */
			async connectMqtt () {
				if (this.$mqttTool.client === null) {
					await this.$mqttTool.connect(this.vuex_token);
				}
				this.mqttCallback();
				// 获取设备信息并订阅主题
				this.getDevice();
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
					};
					if (topics[3] == 'status' || topics[2] == 'status') {
						console.log('接收到【设备状态-详情】主题：', topic);
						console.log('接收到【设备状态-详情】内容：', message);
						// 更新列表中设备的状态
						if (this.deviceForm.serialNumber == deviceNum) {
							this.deviceForm.status = message.status;
							this.deviceForm.isShadow = message.isShadow;
							this.deviceForm.rssid = message.rssid;
						}
					};
					//不是modbus不转发到子页面，其他设备的页面有回调方法
					if (this.isSubDev) {
						/*发送设备上报到子模块*/
						if (topic.endsWith('ws/service')) {
							console.log('接收到【设备数据上报】主题：', topic)
							console.log('接收到【设备数据上报】主题：', message)
							this.$bus.$emit("updateDeviceStatus", {
								serialNumber: topics[2],
								productId: this.deviceForm.productId,
								data: message,
							})
						}
					}
				});
			},
			/** Mqtt订阅主题 */
			mqttSubscribe (device) {
				// 订阅当前设备状态和实时监测
				let topicStatus = '/' + device.productId + '/' + device.serialNumber + '/status/post';
				let topicMonitor = '/' + device.productId + '/' + device.serialNumber + '/monitor/post';
				let topicProperty = '/' + device.productId + '/' + device.serialNumber + '/property/post';
				let topicFunction = '/' + device.productId + '/' + device.serialNumber + '/function/post';
				let topics = [];
				//订阅ws推送
				if (device.subDeviceList && device.subDeviceList.length > 0 && this.isSubDev) {
					device.subDeviceList.forEach(value => {
						let devTopic = "/" + device.productId + "/" + value.serialNumber + "/ws/service"
						topics.push(devTopic);
					})
				}
				topics.push(topicStatus);
				topics.push(topicMonitor);
				topics.push(topicFunction);
				// modbus设备不订阅此topic
				if (!this.isSubDev) {
					topics.push(topicProperty);
				}
				this.$mqttTool.subscribe(topics);
			},
			/** Mqtt取消订阅主题 */
			mqttUnSubscribe (device) {
				// 订阅当前设备状态和实时监测
				let topicStatus = '/' + device.productId + '/' + device.serialNumber + '/status/post';
				let topicMonitor = '/' + device.productId + '/' + device.serialNumber + '/monitor/post';
				let topicProperty = '/' + device.productId + '/' + device.serialNumber + '/property/post';
				let topicFunction = '/' + device.productId + '/' + device.serialNumber + '/function/post';
				let topics = [];
				//订阅ws推送
				if (device.subDeviceList && device.subDeviceList.length > 0 && this.isSubDev) {
					device.subDeviceList.forEach(value => {
						let devTopic = "/" + device.productId + "/" + value.serialNumber + "/ws/service"
						topics.push(devTopic);
					})
				}
				topics.push(topicStatus);
				topics.push(topicMonitor);
				topics.push(topicFunction);
				// modbus设备不订阅此topic
				if (!this.isSubDev) {
					topics.push(topicProperty); //通过网关再转发
				}
				this.$mqttTool.unsubscribe(topics);
				console.log('取消订阅', topics);
			},
			// 单击选显卡
			tabClick (item) {
				this.tabIndex = item.index;
			},
			// 导航栏改变
			tabbarChange () {},
			// 导航栏单击
			tabbarClick (index) {
				this.tabbarIndex = index;
			},
			// 格式化版本显示
			formatVersion (version) {
				return `Version ${version}`;
			},
			// 刷新设备
			onPullDownRefresh () {
				if (this.tabbarIndex == 0) {
					if (this.tabIndex == 0) {
						// 设备运行状态
						this.getDevice();
						this.$refs.runningStatus.baseStatusRefresh();
					} else if (this.tabIndex == 2) {
						// 设备信息
						this.getDevice();
					} else {
						uni.stopPullDownRefresh();
					}
				} else if (this.tabbarIndex == 1) {
					// 设备定时
					this.$refs.deviceTimer.deviceTimerRefresh();
					uni.stopPullDownRefresh();
				} else if (this.tabbarIndex == 3) {
					// 设备统计
					this.$refs.deviceStatistic.getCacheThingsModdel();
				} else {
					uni.stopPullDownRefresh();
				}
			},
			/**获取设备详情*/
			getDevice () {
				getDevice(this.deviceId).then(async response => {
					try {
						let data = response.data;
						if (data.deviceType !== 3) {
							// 获取缓存物模型
							data.cacheThingsModel = await this.getCacheThingsModdel(data.productId);
							// 获取设备运行状态
							data.thingsModels = await this.getRunningStatusInfo(this.deviceId, data.slaveId);
							// 格式化物模型，拆分出监测值,数组添加前缀
							this.formatThingsModel(data);
						} else {
							// 获取通道列表
							this.channelList = await this.getChannelList(data.serialNumber);
						}
						this.title = data.deviceName;
						this.isSubDev = data.subDeviceList.length > 0;
						this.imageUrl = data.imgUrl;
						if (this.imageUrl != null && this.imageUrl != '') {
							this.imageUrl = projectConfig.baseUrl + this.imageUrl;
						} else {
							this.imageUrl = '/static/device.png';
						}
						// 禁用状态
						if (data.status == 2) {
							this.deviceDisable = 1;
						}
						// 设置监控设备
						if (data.deviceType == 3) {
							this.tabList = [{
								name: '设备通道'
							}, {
								name: '设备详情'
							}];
						}
						// 获取定位方式
						data.locationWayInfo = getLocationWayInfo(data.locationWay);
						//Mqtt订阅
						uni.stopPullDownRefresh();
						this.mqttSubscribe(data);
						this.deviceForm = data;

					} catch (e) {
						console.log(e);
					}
				});
			},
			// 设置设备的状态（1-未激活，2-禁用，3-在线，4-离线）
			setDeviceStatus () {
				if (this.deviceDisable == 1) {
					this.deviceForm.status = 2;
				} else {
					// 禁用状态，启用后状态是离线
					if (this.deviceForm.status == 2) {
						this.deviceForm.status = 4;
					}
				}
			},
			// 设备数据同步
			deviceSynchronization () {
				deviceSynchronization(this.deviceForm.serialNumber).then(async response => {
					try {
						let data = response.data;
						if (data.deviceType !== 3) {
							// 获取缓存物模型
							data.cacheThingsModel = await this.getCacheThingsModdel(data.productId);
							// 获取设备运行状态
							data.thingsModels = await this.getRunningStatusInfo(this.deviceId, data.slaveId);
							// 格式化物模型，拆分出监测值,数组添加前缀
							this.formatThingsModel(data);
						}
						this.title = data.deviceName;
						this.imageUrl = data.imgUrl;
						if (this.imageUrl != null && this.imageUrl != '') {
							this.imageUrl = projectConfig.baseUrl + this.imageUrl;
						} else {
							this.imageUrl = '/static/device.png';
						}
						// 禁用状态
						if (data.status == 2) {
							this.deviceDisable = 1;
						}
						this.deviceForm = response.data;
					} catch (e) {
						console.log(e);
					}
				});
			},
			/** 删除设备按钮操作 */
			handleDelete () {
				this.content = '是否确认删除 ' + this.deviceForm.deviceName + ' ？';
				this.show = true;
			},
			// 确认删除设备
			confirm () {
				this.show = false;
				delDevice(this.deviceForm.deviceId).then(res => {
					if (res.code == 200) {
						// 跳转主页,通过globalData传递参数
						getApp().globalData.operate = 'operate';
						uni.$u.route({
							type: 'switchTab',
							url: '/pages/tabBar/home/home'
						});
					} else if (res.code == 500) {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
					}
				});
			},
			// 取消
			cancel () {
				this.show = false;
			},
			/** 提交按钮 */
			submitForm () {
				if (!this.deviceForm.locationWay) {
					uni.showToast({
						icon: 'none',
						title: '定位方式不能为空'
					});
					return;
				}
				this.$refs.deviceForm.validate().then(e => {
					if (this.deviceForm.deviceId !== 0) {
						this.setDeviceStatus(); // 设置设备状态
						let device = {
							deviceId: this.deviceForm.deviceId,
							deviceName: this.deviceForm.deviceName,
							isShadow: this.deviceForm.isShadow,
							status: this.deviceForm.status,
							remark: this.deviceForm.remark,
							locationWay: this.deviceForm.locationWay,
							longitude: this.deviceForm.longitude,
							latitude: this.deviceForm.latitude,
							networkAddress: this.deviceForm.networkAddress
						};
						updateDevice(device).then(res => {
							if (res.code === 200) {
								uni.showToast({
									icon: 'success',
									title: '修改成功'
								});
							}
						});
					}
				});
			},
			gotoShare () {
				uni.$u.route('/pagesA/list/home/deviceShare/list', {
					deviceId: this.deviceForm.deviceId,
					deviceName: this.deviceForm.deviceName
				});
			},
			/** 获取缓存物模型*/
			getCacheThingsModdel (productId) {
				return new Promise((resolve, reject) => {
					cacheJsonThingsModel(productId).then(res => {
						resolve(JSON.parse(res.data));
					}).catch(err => {
						reject(err);
					})
				})
			},
			// 获取设备运行状态
			getRunningStatusInfo (deviceId, slaveId) {
				return new Promise((resolve, reject) => {
					getRunningStatus(deviceId, slaveId).then(res => {
						resolve(res.data.thingsModels);
					}).catch(err => {
						reject(err);
					})
				});
			},
			// 物模型格式化
			formatThingsModel (data) {
				if (data && data.length !== 0) {
					data.chartList = [];
					data.monitorList = [];
					data.statisticList = [];
					for (let i = 0; i < data.thingsModels.length; i++) {
						if (data.thingsModels[i].datatype.type === "array") {
							if (data.thingsModels[i].datatype.arrayType === "object") {
								for (let k = 0; k < data.thingsModels[i].datatype.arrayParams.length; k++) {
									for (let j = 0; j < data.thingsModels[i].datatype.arrayParams[k].length; j++) {
										// 数组元素中参数ID添加前缀，例如：array_00_
										let index = k > 9 ? String(k) : '0' + k;
										let prefix = 'array_' + index + '_';
										data.thingsModels[i].datatype.arrayParams[k][j].id = prefix + data.thingsModels[i]
											.datatype.arrayParams[k][j].id;
										// 图表、实时监测、监测统计分类放置
										if (data.thingsModels[i].datatype.arrayParams[k][j].isChart === 1) {
											data.thingsModels[i].datatype.arrayParams[k][j].name = "[" + data.thingsModels[
													i].name + (k + 1) + "] " + data.thingsModels[i].datatype.arrayParams[k]
												[j].name;
											data.thingsModels[i].datatype.arrayParams[k][j].datatype.arrayType = "object";
											data.chartList.push(data.thingsModels[i].datatype.arrayParams[k][j]);
											// 监测统计
											if (data.thingsModels[i].datatype.arrayParams[k][j].isHistory == 1) {
												data.statisticList.push(data.thingsModels[i].datatype.arrayParams[k][j]);
											}
											// 实时监测
											if (data.thingsModels[i].datatype.arrayParams[k][j].isMonitor == 1) {
												data.monitorList.push(data.thingsModels[i].datatype.arrayParams[k][j]);
											}
											data.thingsModels[i].datatype.arrayParams[k].splice(j--, 1);
										}
									}
								}
							} else {
								// 字符串拆分为物模型数组 model=id/name/type/isReadonly/value/shadow
								let values = data.thingsModels[i].value != "" ? data.thingsModels[i].value.split(',') : [];
								let shadows = data.thingsModels[i].shadow != "" ? data.thingsModels[i].shadow.split(',') :
									[];
								for (let j = 0; j < data.thingsModels[i].datatype.arrayCount; j++) {
									if (!data.thingsModels[i].datatype.arrayModel) {
										data.thingsModels[i].datatype.arrayModel = [];
									}
									// 数组里面的ID需要添加前缀和索引，例如：array_00_temperature
									let index = j > 9 ? String(j) : '0' + j;
									let prefix = 'array_' + index + '_';
									data.thingsModels[i].datatype.arrayModel[j] = {
										id: prefix + data.thingsModels[i].id,
										name: data.thingsModels[i].name,
										type: data.thingsModels[i].type,
										isReadonly: data.thingsModels[i].isReadonly,
										value: values[j] ? values[j] : "",
										shadow: shadows[j] ? shadows[j] : ""
									}
								}
							}
						} else if (data.thingsModels[i].datatype.type === "object") {
							for (let j = 0; j < data.thingsModels[i].datatype.params.length; j++) {
								// 图表、实时监测、监测统计分类放置
								if (data.thingsModels[i].datatype.params[j].isChart === 1) {
									// 图表
									data.thingsModels[i].datatype.params[j].name = "[" + data.thingsModels[i].name + "] " +
										data.thingsModels[i].datatype.params[j].name;
									data.chartList.push(data.thingsModels[i].datatype.params[j]);
									// 监测统计
									if (data.thingsModels[i].datatype.params[j].isHistory == 1) {
										data.statisticList.push(data.thingsModels[i].datatype.params[j]);
									}
									// 实时监测
									if (data.thingsModels[i].datatype.params[j].isMonitor == 1) {
										data.monitorList.push(data.thingsModels[i].datatype.params[j]);
									}
									data.thingsModels[i].datatype.params.splice(j--, 1);
								}
							}
						} else if (data.thingsModels[i].isChart === 1) {
							// 图表、实时监测、监测统计分类放置
							data.chartList.push(data.thingsModels[i]);
							// 监测统计
							if (data.thingsModels[i].isHistory == 1) {
								data.statisticList.push(data.thingsModels[i]);
							}
							// 实时监测
							if (data.thingsModels[i].isMonitor == 1) {
								data.monitorList.push(data.thingsModels[i]);
							}
							// 使用i--解决索引变更问题
							data.thingsModels.splice(i--, 1);
						}
					}
				}
			},
			// 设备通道
			getChannelList (serialNumber) {
				this.channelQueryParams.deviceSipId = serialNumber;
				return new Promise((resolve, reject) => {
					listChannel(this.channelQueryParams).then(response => {
						this.channelTotal = response.total;
						response.rows.map(item => {
							item.statusInfo = getSipStatusInfo(item.status);
							return item;
						})
						resolve(response.rows);
					}).catch(error => {
						reject(error);
					});
				});
			},
			gotoDevicePlayer (deviceSipId, channelSipId, status) {
				let statusInfo = getSipStatusInfo(status)
				if (status !== 2) {
					uni.showToast({
						icon: 'none',
						title: `无法查看${getSipStatusInfo(status).name}数据`
					});
					return;
				}
				// #ifdef H5
				uni.$u.route('/pages_player/list/devicePlayer', {
					deviceId: deviceSipId,
					channelSipId: channelSipId,
				});
				//#endif
				// #ifdef MP-WEIXIN
				uni.showToast({
					icon: 'none',
					title: '暂不支持微信小程序'
				});
				//#endif
				// #ifdef APP-PLUS
				uni.showToast({
					icon: 'none',
					title: '请使用wap2app方式打包！'
				});
				//#endif
			},
			async onReachBottom () {
				if (this.tabIndex === 0) {
					this.channelLoadStatus = 'loading';
					this.channelQueryParams.pageNum = this.channelQueryParams.pageNum + 1;
					if ((this.channelQueryParams.pageNum - 1) * this.channelQueryParams.pageSize >= this
						.channelTotal) {
						this.channelLoadStatus = 'nomore';
					} else {
						let list = await this.getChannelList(this.deviceForm.serialNumber);
						this.channelList = this.channelList.concat(list);
						this.channelLoadStatus = 'nomore';
					}
				}
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

		.card-title-wrap {
			display: flex;
			padding: 6px;
			padding-left: 0;
			border-bottom: 1px solid #efefef;
		}
	}

	.channel_wrap {
		padding: 6px 0;

		.item_body {
			position: relative;
			display: flex;
			align-items: center;
			margin-bottom: 6px;
			background: #fff;

			.img {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-radius: 5px;
				width: 90px;
				height: 60px;
				background: #e5e5e5;
				margin: 10px;
			}

			.status {
				position: absolute;
				right: 13px;
				top: 13px;
			}
		}
	}
</style>