<template>
	<page-meta><navigation-bar title="添加设备" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view class="card">
			<u--form labelPosition="left" :model="form" :rules="rules" ref="form" labelWidth="80" labelAlign="center">
				<view style="padding:10px 0;;border-bottom:1px solid #EFEFEF;display:flex;">
					<u--text prefixIcon="grid-fill" iconStyle="font-size: 16px;color:#606266" text="第一步: 填写WIFI信息" bold
						color="#606266"></u--text>
				</view>
				<u-form-item label="WIFI名称" prop="SSID"><u-input v-model="form.SSID"
						placeholder="请输入WIFI名称"></u-input></u-form-item>
				<u-form-item label="WIFI密码" prop="password">
					<u-input v-model="form.password" placeholder="请输入WIFI密码" :type="passwordShow ? 'text' : 'password'">
						<template slot="suffix">
							<view @click="passwordShow = !passwordShow"><u-icon name="eye-off" size="24"
									v-if="!passwordShow" color="#666"></u-icon></view>
							<view @click="passwordShow = !passwordShow"><u-icon name="eye-fill" size="24"
									v-if="passwordShow" color="#666"></u-icon></view>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item label=" ">
					<u-checkbox-group v-model="checkboxConfigs">
						<u-checkbox :customStyle="{ marginRight: '15px' }" label="记住密码" name="remeber"></u-checkbox>
						<u-checkbox :customStyle="{}" label="高级" name="advance"></u-checkbox>
					</u-checkbox-group>
				</u-form-item>
			</u--form>
			<view v-if="checkboxConfigs.indexOf('advance') != -1">
				<u--form labelPosition="left" :model="form" :rules="rules" ref="form2" labelWidth="80"
					labelAlign="center" :labelStyle="{ color: '#3fd1ad', fontSize: '14px' }">
					<u-form-item label="用户编号" prop="userId">
						<u-input v-model="form.userId" placeholder="请输入用户编号" :disabled="userIdDisabled">
							<template slot="suffix">
								<view @click="userIdDisabled = !userIdDisabled"><u-icon name="lock-fill" size="24"
										v-if="userIdDisabled" color="#666"></u-icon></view>
								<view @click="userIdDisabled = !userIdDisabled"><u-icon name="lock-opened-fill"
										size="24" v-if="!userIdDisabled" color="#666"></u-icon></view>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item label="设备编号" prop="deviceNum">
						<u-input v-model="form.deviceNum" placeholder="请输入设备编号">
							<template slot="suffix">
								<u-icon name="scan" color="#666" size="24" @click="openScan"></u-icon>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item label="授 权 码" prop="authCode"><u-input v-model="form.authCode"
							placeholder="请输入授权码"></u-input></u-form-item>
					<u-form-item label="补充信息" prop="extra">
						<u-textarea v-model="form.extra" height="40" fontSize="14" placeholder="请输入补充信息"
							confirmType="done"></u-textarea>
					</u-form-item>
				</u--form>
			</view>
		</view>

		<view class="card">
			<view style="padding:10px 0;">
				<u--text prefixIcon="grid-fill" iconStyle="font-size: 16px;color:#606266" text="第二步: 设备进入配网模式" bold
					color="#606266"></u--text>
			</view>
		</view>

		<view class="card">
			<view style="padding:0;border-bottom:1px solid #EFEFEF;display:flex;">
				<u--text prefixIcon="grid-fill" iconStyle="font-size: 16px;color:#606266" text="第三步: 配网" bold
					color="#606266"></u--text>
				<view>
					<u-tabs :list="[{ name: '单设备' }, { name: '多设备' }]" :current="tabIndex" :scrollable="false"
						lineWidth="50" lineHeight="2" :duration="100" @click="tabClick"></u-tabs>
				</view>
			</view>
			<view v-if="tabIndex == 0">
				<view style="margin:30px 0 0 0;display:flex;">
					<u-steps :current="step" direction="column">
						<u-steps-item title="设备进入配网模式" desc="设备会启动WIFI热点"></u-steps-item>
						<u-steps-item title="手动连接设备热点" desc="手机连接设备WIFI热点"></u-steps-item>
						<u-steps-item title="检测设备" desc="系统自动检测"></u-steps-item>
						<u-steps-item title="配网结束" desc="手机可重新连接WIFI"></u-steps-item>
					</u-steps>
					<view style="margin:0 auto;">
						<circleProgress :percent="progress" borderWidth="12" width="260">
							<view>
								<text style="font-size:24px;display:block;">{{ progress }}%</text>
							</view>
						</circleProgress>
						<view style="display:flex;">
							<u-loading-icon customStyle="width:30px;margin-left:10px;" size="12"
								v-if="step < 2"></u-loading-icon>
							<u--text :text="count.text" :type="count.type" size="12"
								:customStyle="step < 2 ? '' : 'margin:0 auto;'"></u--text>
						</view>
					</view>
				</view>
				<view style="padding:30px 10px;" v-if="step < 3"><u-button text="开始配网" type="primary"
						@click="beginConfig" :disabled="step < 2"></u-button></view>
				<view style="padding:30px 10px;" v-if="step == 4"><u-button text="重新配网" type="warning"
						@click="restartConfig"></u-button></view>
				<view style="padding:30px 10px;" v-if="step == 3"><u-button text="手机重连Wifi后, 返回查看" type="primary"
						@click="goBack"></u-button></view>
			</view>
			<view v-if="tabIndex == 1">
				<view style="margin:20px 0 0 10px;"><u--text type="warning" text="提示：多设备配网目前只支持微信小程序, 需要启用手机Wifi开关"
						size="12"></u--text></view>
				<uni-table ref="table" :loading="loading" emptyText="暂无更多数据" style="margin-top:10px;">
					<uni-tr>
						<uni-th>
							<view style="display:flex;width:100%;">
								<view style="flex:1;"><u--text size="15" color="#606266" lines="1"
										text="请选择设备热点"></u--text></view>
								<view style="width:40px;">
									<u-button text="刷新" :disabled="!isWeChat || updateDisable" size="mini"
										type="primary" @click="updateWfifiListInWeChat"></u-button>
								</view>
							</view>
						</uni-th>
					</uni-tr>
					<uni-tr v-for="(wifi, index) in wifiList" :key="index">
						<uni-td v-if="wifi.signalStrength > 0">
							<view @click="selectChange(wifi)">
								<view style="display:flex;margin:-10px;padding:10px 0;">
									<view style="width:35px;align-self:center;">
										<checkbox :checked="wifi.checked" style="transform:scale(0.8)"
											color="#3c9cff" />
									</view>
									<view style="flex:1">
										<view style="display:flex;line-height:30px;align-items: center;">
											<view style="flex:1;">
												<u--text size="14" :color="wifi.secure ? '#999' : '#3c9cff'"
													:text="wifi.SSID"></u--text>
											</view>
											<view style="margin-right: 10px;">
												<u-icon v-if="wifi.signalStrength > 0 &&  wifi.signalStrength < 25"
													name="/static/wifi_1.png" size="14"></u-icon>
												<u-icon v-if="wifi.signalStrength >= 25 &&  wifi.signalStrength < 50"
													name="/static/wifi_2.png" size="14"></u-icon>
												<u-icon v-if="wifi.signalStrength >= 50 &&  wifi.signalStrength < 75"
													name="/static/wifi_3.png" size="14"></u-icon>
												<u-icon v-if="wifi.signalStrength >= 75 &&  wifi.signalStrength <= 100"
													name="/static/wifi_4.png" size="14"></u-icon>
											</view>
										</view>
										<view style="display:flex;" v-if="wifi.checked == true">
											<view style="width:100%;margin-top:6px;"><u-line-progress
													:percentage="wifi.process" activeColor="#3c9cff"></u-line-progress>
											</view>
											<view style="width:70px;margin-left:6px;"><u--text size="12"
													:text="wifi.text" :type="wifi.type"></u--text></view>
										</view>
									</view>
								</view>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view style="padding:20px 10px;" v-if="mstep == 0"><u-button text="开始配网" type="primary"
						@click="beginConfigInWeChart" :disabled="!isWeChat"></u-button></view>
				<view style="padding:20px 10px;" v-if="mstep == 1"><u-button text="配网中..." type="primary"
						:loading="true"></u-button></view>
				<view style="padding:20px 10px;" v-if="mstep == 2"><u-button text="正在连接网络..." type="primary"
						:loading="true"></u-button></view>
				<view style="padding:20px 10px;" v-if="mstep == 3"><u-button text="返回查看" type="primary"
						@click="goBack"></u-button></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getProfile } from '@/apis/modules/common';

	export default {
		data () {
			return {
				// 是否为微信小程序
				isWeChat: false,
				// 复选框配置remeber、advance
				checkboxConfigs: ['remeber'],
				// 配网模式选项卡索引
				tabIndex: 0,
				// wifi密码可见性
				passwordShow: true,
				// 用户编号是否可编辑
				userIdDisabled: true,
				// wifi信息
				form: {
					type: 0, // 类型0=设备配网，1=关联设备
					SSID: '',
					password: '',
					userId: 0,
					deviceNum: '',
					authCode: '',
					extra: ''
				},
				// 计数
				count: {
					// 进度定时器
					timer: {},
					// 显示文本
					text: '未检测到设备',
					// 文字类型
					type: 'warning'
				},
				// 发现设备计时器
				discoverTimer: {},
				// 单设备配网进度
				progress: 0,
				// 单设备配网步骤
				step: 1,

				// wifi列表加载
				loading: false,
				// wifi列表
				wifiList: [
					// {
					// 	SSID: 'wumei-device1',
					// 	secure: false,
					// 	signalStrength: 30,
					// 	checked: false,
					// 	process: 0,
					// 	text: '准备配网',
					// 	type: 'primary'
					// },
					// {
					// 	SSID: 'wumei-device2',
					// 	secure: true,
					// 	signalStrength: 90,
					// 	checked: false,
					// 	process: 0,
					// 	text: '准备配网',
					// 	type: 'primary'
					// }
				],
				// 选中的wifi列表
				selectedWifiList: [],
				// Wifi表格选中的索引
				// index: [],
				// 多设备配网步骤,0=未开始配网，1=配网中，2=配网结束
				mstep: 0,
				// 更新WIFI按钮
				updateDisable: false,
				rules: {
					SSID: [{
						required: true,
						message: 'WIFI名称不能为空',
						trigger: ['blur', 'change']
					}],
					password: [{
						required: true,
						message: 'WIFI密码不能为空',
						trigger: ['blur', 'change']
					}],
					userId: [{
						required: true,
						message: '用户编号不能为空',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		created () {
			// #ifdef MP-WEIXIN
			this.initInWeChat();
			this.tabIndex = 1;
			this.isWeChat = true;
			// #endif

			// #ifndef MP-WEIXIN
			this.tabIndex = 0;
			// #endif

			//获取登录用户信息
			if (this.profile == null) {
				this.getProfile();
			} else {
				this.form.userId = this.profile.userId;
			}
			// 断开Mqtt连接
			this.endMqtt();
			// 获取WIFI信息
			this.getWifi();
			if (this.tabIndex == 0) {
				// 发现设备
				this.discoverDevice();
			}
		},
		onUnload () {
			clearInterval(this.discoverTimer);
			// 页面卸载时连接mqtt
			this.connectMqtt();
		},
		methods: {
			/* 断开Mqtt消息服务器 */
			async endMqtt () {
				await this.$mqttTool.end();
			},
			/* 连接Mqtt消息服务器 */
			async connectMqtt () {
				if (this.$mqttTool.client == null) {
					console.log('连接mqtt...');
					await this.$mqttTool.connect(this.vuex_token);
				}
			},
			// 获取登录用户信息
			getProfile () {
				// 调用用户信息接口
				getProfile().then(res => {
					//存储用户信息,TODO 需要调用一次，不然其他页面调用返回空
					uni.$u.vuex('profile', res.data);
					this.profile;
					this.form.userId = this.profile.userId;
				}).catch(err => {
					this.$u.toast(err.msg);
				});
			},
			// 单击选显卡
			tabClick (item) {
				this.tabIndex = item.index;
				if (this.tabIndex == 0) {
					// 发现设备
					this.discoverDevice();
				} else {
					// 清除发现设备定时器
					clearInterval(this.discoverTimer);
				}
			},
			// 返回
			goBack () {
				getApp().globalData.operate = 'operate';
				uni.navigateBack({
					delta: 1
				});
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
							let json = JSON.parse(res.result);
							// type=1 代表扫码关联设备
							if (json.type == 1) {
								this.form.deviceNum = json.deviceNumber;
								return;
							}
							uni.showToast({ icon: 'none', title: '解析二维码，格式不正确' });
						} catch (error) {
							uni.showToast({ icon: 'none', title: '解析二维码，格式不正确' });
						}
					}
				});
			},
			// 保存WIFI
			saveWifi () {
				if (this.form.SSID != '' && this.form.password != '') {
					// 本地缓存存储
					uni.setStorageSync('WIFI_SSID', this.form.SSID);
					uni.setStorageSync('WIFI_PASSWORD', this.form.password);
				}
			},
			// 获取WIFI
			getWifi () {
				// 本地缓存获取
				let wifi_ssid = uni.getStorageSync('WIFI_SSID');
				let wifi_password = uni.getStorageSync('WIFI_PASSWORD');
				if (wifi_ssid && wifi_ssid != '') {
					this.form.SSID = wifi_ssid;
				}
				if (wifi_password && wifi_password != '') {
					this.form.password = wifi_password;
				}
			},
			// 获取配网接口地址
			getParamString () {
				console.log('form', this.form);
				let ip = 'http://192.168.4.1/config';
				let params = '?SSID=' + this.form.SSID + '&password=' + this.form.password + '&userId=' + this.form.userId;
				if (this.form.deviceNum && this.form.deviceNum != '') {
					params = params + '&deviceNum=' + this.form.deviceNum;
				}
				if (this.form.deviceName && this.form.deviceName != '') {
					params = params + '&deviceName=' + this.form.deviceName;
				}
				if (this.form.authCode && this.form.authCode != '') {
					params = params + '&authCode=' + this.form.authCode;
				}
				if (this.form.extra && this.form.extra != '') {
					params = params + '&extra=' + this.form.extra;
				}
				return ip + params;
			},
			// 设备AP配网
			apConfig () {
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.getParamString(),
						method: 'POST',
						timeout: 10000,
						success: res => {
							resolve(true);
						},
						fail: res => {
							reject(false);
						}
					});
				});
			},

			/****************************************** 单设备 *********************************************/
			// 检查设备是否配网准备就绪
			discoverDevice () {
				this.discoverTimer = setInterval(() => {
					if (this.tabIndex == 0) {
						uni.request({
							url: 'http://192.168.4.1/status',
							method: 'GET',
							timeout: 5000,
							success: res => {
								clearInterval(this.discoverTimer);
								this.step = 2;
								this.progress == 0;
								this.count = {
									text: '已检测到设备',
									type: 'success',
									process: 0
								};
							}
						});
					}
				}, 5000);
			},
			// 配网进度显示
			showConfigProgress () {
				this.count.timer = setInterval(() => {
					if (this.progress == 96) {
						clearInterval(this.count.timer);
					} else {
						this.progress = this.progress + 1;
					}
				}, 100);
			},
			// 重新开始配网
			restartConfig () {
				this.progress = 0;
				this.step = 1;
				this.count = {
					// 进度定时器
					timer: {},
					// 显示文本
					text: '未检测到设备',
					// 文字类型
					type: 'warning'
				};
				this.discoverDevice();
			},
			// 开始配网
			async beginConfig () {
				// 验证用户编号和WIFI信息
				if (!this.$refs.form.validate()) {
					uni.$u.toast('用户编号和WIFI账号密码不能为空');
					return;
				}
				//保存WIFI信息
				if (this.checkboxConfigs.indexOf('remeber') != -1) {
					this.saveWifi();
				}
				// 设置进度
				this.progress = 0;
				this.showConfigProgress();
				this.count.text = '发送配置信息...';
				this.count.type = 'info';
				// 配网
				try {
					let result = await this.apConfig();
					console.log('ap config result:', result);
					if (result) {
						// 清除计数器
						clearInterval(this.count.timer);
						this.progress = 100;
						this.count.text = '配网成功，如果设备没有正常连接，请检查WIFI信息是否正确以及网络状况';
						this.count.type = 'success';
						this.step = 3;
					} else {
						// 清除计数器
						clearInterval(this.count.timer);
						this.count.text = '配网失败，请确认设备进入配网模式，并连接了该热点';
						this.count.type = 'error';
						this.step = 4;
					}
				} catch (e) {
					// 清除计数器
					clearInterval(this.count.timer);
					this.count.text = '配网失败，请确认设备进入配网模式，并连接了该热点';
					this.count.type = 'error';
					this.step = 4;
				}
			},

			/****************************************** 多设备,小程序可用 *********************************************/
			// 表格中的Wifi选择改变
			selectChange (wifi) {
				if (wifi.checked == true) {
					wifi.checked = false;
					for (let i = 0; i < this.selectedWifiList.length; i++) {
						if (wifi.SSID == this.selectedWifiList[i].SSID) {
							this.selectedWifiList.splice(i, 1);
						}
					}
				} else {
					wifi.checked = true;
					this.selectedWifiList.push(wifi);
				}
				console.log(this.selectedWifiList);
			},
			// 获取选中Wifi在所有wifi列表中的索引
			getWifiIndex (SSID) {
				for (let i = 0; i < this.wifiList.length; i++) {
					if (SSID == this.wifiList[i].SSID) {
						return i;
					}
				}
				return -1;
			},
			// 小程序多设备配网
			async beginConfigInWeChart () {
				// 验证用户编号和WIFI信息
				if (!this.$refs.form.validate()) {
					uni.$u.toast('用户编号和WIFI账号密码不能为空');
					return;
				}
				// 判断是否选择了设备热点
				if (this.selectedWifiList.length == 0) {
					uni.$u.toast('请选择设备热点');
					return;
				}
				//保存WIFI信息
				if (this.checkboxConfigs.indexOf('remeber') != -1) {
					this.saveWifi();
				}
				this.mstep = 1;
				let that = this;
				for (let i = 0; i < that.selectedWifiList.length; i++) {
					let index = this.getWifiIndex(that.selectedWifiList[i].SSID);
					console.log('wifi在列表中的索引：', index);
					// 配网进度显示
					that.wifiList[index].type = 'primary';
					that.wifiList[index].text = '配网中...';
					let processTimer = setInterval(() => {
						if (that.wifiList[index].process == 90) {
							clearInterval(processTimer);
						} else {
							that.wifiList[index].process = that.wifiList[index].process + 1;
						}
					}, 350);
					// 微信连接设备热点
					try {
						let result = await that.connectWifiInWeChat(that.wifiList[index].SSID, '');
						console.log('连接设备热点： ' + that.wifiList[index].SSID + ' result:', result);
						if (result == true) {
							// 配网
							let apResult = await that.apConfig();
							console.log('AP配网，result:', apResult);
							if (apResult == true) {
								// 配网成功
								clearInterval(processTimer);
								that.wifiList[index].process = 100;
								that.wifiList[index].type = 'success';
								that.wifiList[index].text = '配网成功';
							} else {
								// 配网失败
								that.failConfigInWeChat(that.wifiList[index], processTimer);
							}
						}
					} catch (e) {
						console.log('连接WIFI异常，catch: ', e);
						// 配网失败
						that.failConfigInWeChat(that.wifiList[index], processTimer);
					}
				}
				//配网成功后停止wifi然后启动、手机自动连接wifi
				that.mstep = 2;
				try {
					console.log('停止Wifi...');
					await that.stopWifiInWeChat();
				} catch (e) {
					console.log('停止Wifi异常', e);
					uni.showToast({ icon: 'none', title: '配网后，请连接上网用的Wifi' });
				}
				try {
					console.log('启动Wifi...');
					await that.startWifiInWeChat();
				} catch (e) {
					console.log('启动Wifi异常', e);
					uni.showToast({ icon: 'none', title: '配网后，请连接上网用的Wifi' });
				}
				that.mstep = 3;
			},
			// 多设备配网失败
			failConfigInWeChat (wifi, processTimer) {
				clearInterval(processTimer);
				wifi.type = 'error';
				wifi.text = '配网失败';
			},
			// 微信小程序连接wifi
			connectWifiInWeChat (ssid, password) {
				return new Promise((resolve, reject) => {
					wx.connectWifi({
						SSID: ssid,
						password: password,
						success: res => {
							resolve(true);
						},
						fail: res => {
							reject(res);
						}
					});
				});
			},
			// 微信小程序停止wifi
			stopWifiInWeChat () {
				return new Promise((resolve, reject) => {
					wx.stopWifi({
						success: res => {
							resolve(true);
						},
						fail: res => {
							reject(res);
						}
					});
				});
			},
			// 微信小程序启动wifi
			startWifiInWeChat () {
				return new Promise((resolve, reject) => {
					wx.startWifi({
						success: res => {
							resolve(true);
						},
						fail: res => {
							reject(res);
						}
					});
				});
			},
			// 获取连接的wifi信息
			getConnectedWifiInWeChart () {
				let that = this;
				wx.getConnectedWifi({
					success: res => {
						console.log('success wifi info ', res);
						if (that.form.SSID == '') {
							that.form.SSID = res.wifi.SSID;
						}
					},
					fail: res => {
						console.log(res);
						uni.showToast({ icon: 'none', title: '请确保手机Wifi已打开，然后重新进入页面' });
					}
				});
			},
			// 获取wifi列表
			getWifiListInWeChart () {
				let that = this;
				that.wifiList = [];
				wx.getWifiList({
					// 请求获取wifi列表
					success: function (e) {
						wx.onGetWifiList(function (res) {
							console.log('wifi列表');
							console.log(res.wifiList);
							let platform = uni.getSystemInfoSync().platform;
							let tmpList = [];
							res.wifiList.map(item => {
								if (item.SSID.length > 0) {
									// 设置热点的配网进度默认为0,未选中状态,进度条默认蓝色
									item.process = 0;
									item.checked = false;
									item.type = 'primary';
									item.text = '准备配网';
									item.signalStrength = platform === 'ios' ? Math.round(item
											.signalStrength * 100) : item
										.signalStrength //ios signalStrength 值是0-1, android 值是1-100
									tmpList.push(item);
								}
							});
							that.wifiList = tmpList; // 存放wifi列表
							console.log('列表数据', that.wifiList);
							that.loading = false;
							// 配网未开始
							that.mstep = 0;
						});
					},
					fail: res => {
						console.log(res);
						uni.showToast({ icon: 'none', title: '请确保手机Wifi已打开，然后重新进入页面' });
					}
				});
			},
			// 更新WIFI列表
			updateWfifiListInWeChat () {
				// 清空选中的wifi
				this.selectedWifiList = [];
				this.updateDisable = true;
				this.initInWeChat();
				setTimeout(res => {
					this.updateDisable = false;
				}, 6000);
			},
			// 小程序初始化Wifi模块
			initInWeChat () {
				let that = this;
				that.loading = true;
				uni.getLocation({
					//授权定位后才能获取wifi
					type: 'wgs84',
					success: function (res) {
						that.wifiList = [];
						wx.startWifi({
							success (res) {
								console.log('启动Wifi模块成功' + res.errMsg);
								// 获取连接的wifi信息
								that.getConnectedWifiInWeChart();
								// 获取wifi列表
								that.getWifiListInWeChart();
							},
							fail: res => {
								that.loading = false;
								console.log('启动Wifi模块失败' + res);
								uni.showToast({ icon: 'none', title: '启动Wifi模块失败，请重新打开小程序' });
							}
						});
					},
					fail: function (error) {
						console.log(error, 'xxx');
						that.loading = false;
						uni.showToast({
							title: '初始化Wifi模块失败,请重新打开小程序',
							icon: 'none'
						});
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		// background: #eef3f7;
		background: linear-gradient(30deg, #46e9a9 30%, #007aff 70%);
		background-size: 100% 100%;
		background-attachment: fixed;
	}

	.container {
		padding-bottom: 50px;
	}

	.card {
		box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
		border-radius: 6px;
		background-color: #fff;
		margin: 10px;
		margin-bottom: 15px;
		padding: 15px 10px;
	}
</style>