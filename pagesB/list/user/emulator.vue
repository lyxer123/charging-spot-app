<template>
	<page-meta><navigation-bar title="设备模拟" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view style="background-color:#fff;padding:10px;margin-bottom:10px;">
			<text style="font-size:14px;color:#999">设备配置</text>
			<u--form labelPosition="left" labelWidth="100" :model="device" :rules="rules" ref="form1">
				<u-form-item label="设备编号" prop="deviceNum" borderBottom leftIcon="tags"><u--input v-model="device.deviceNum" border="none"></u--input></u-form-item>
				<u-form-item label="用户编号" prop="userId" borderBottom leftIcon="tags"><u--input v-model="device.userId" border="none"></u--input></u-form-item>
				<u-form-item label="固件版本" prop="firmwareVersion" borderBottom leftIcon="tags"><u--input v-model="device.firmwareVersion" border="none"></u--input></u-form-item>
				<u-form-item label="NTP地址" prop="ntpServer" borderBottom leftIcon="tags"><u--input v-model="device.ntpServer" border="none"></u--input></u-form-item>
			</u--form>
		</view>

		<view style="background-color:#fff;padding:10px;margin-bottom:10px;">
			<text style="font-size:14px;color:#999">产品配置</text>
			<u--form labelPosition="left" labelWidth="100" :model="device" :rules="rules" ref="form2">
				<u-form-item label="产品编号" prop="productId" borderBottom leftIcon="tags"><u--input v-model="device.productId" border="none"></u--input></u-form-item>
				<u-form-item label="产品秘钥" prop="productSecret" borderBottom leftIcon="tags"><u--input v-model="device.productSecret" border="none" type="password"></u--input></u-form-item>
			</u--form>
		</view>

		<view style="background-color:#fff;padding:10px;margin-bottom:10px;">
			<text style="font-size:14px;color:#999">Mqtt配置</text>
			<u--form labelPosition="left" labelWidth="100" :model="device" :rules="rules" ref="form3">
				<u-form-item label="Mqtt地址" prop="mqttUrl" borderBottom leftIcon="tags"><u--input v-model="device.mqttUrl" border="none"></u--input></u-form-item>
				<u-form-item label="Mqtt账号" prop="mqttUserName" borderBottom leftIcon="tags"><u--input v-model="device.mqttUserName" border="none"></u--input></u-form-item>
				<u-form-item label="Mqtt密码" prop="mqttPassword" borderBottom leftIcon="tags"><u--input v-model="device.mqttPassword" border="none" type="password"></u--input></u-form-item>
			</u--form>
		</view>

		<view class="button-content">
			<u-button text="保存配置" type="primary" customStyle="margin-bottom:20px;"></u-button>
			<view class="button-item"><u-button text="上报属性" size="small" type="primary" @click="click"></u-button></view>
			<view class="button-item"><u-button text="上报功能" size="small" type="success"></u-button></view>
			<view class="button-item"><u-button text="上报事件" size="small" type="error"></u-button></view>
			<view class="button-item"><u-button text="获取时间" size="small" type="success"></u-button></view>
			<view class="button-item"><u-button text="上报监测数据" size="small" type="warning"></u-button></view>
		</view>
	</view>
</template>

<script>
// // 订阅的主题
// String prefix = "/" + productId + "/" + deviceNum;
// String sOtaTopic = prefix + "/ota/get";
// String sNtpTopic = prefix + "/ntp/get";
// String sPropertyTopic = prefix + "/property/get";
// String sFunctionTopic = prefix + "/function/get";
// String sPropertyOnline = prefix + "/property-online/get";
// String sFunctionOnline = prefix + "/function-online/get";
// String sMonitorTopic = prefix + "/monitor/get";
// // 发布的主题
// String pInfoTopic = prefix + "/info/post";
// String pNtpTopic = prefix + "/ntp/post";
// String pPropertyTopic = prefix + "/property/post";
// String pFunctionTopic = prefix + "/function/post";
// String pMonitorTopic = prefix + "/monitor/post";
// String pEventTopic = prefix + "/event/post";

export default {
	data() {
		return {
			device: {
				deviceNum: 'D08DFEEFFFDDB',
				userId: '1',
				productId: '2',
				productSecret: 'STDJKKKLLSSQL',
				firmwareVersion: '1.1',
				mqttUrl: 'localhost:1883',
				mqttUserName: 'wumei-smart',
				mqttPassword: 'PWDFDSDFSDSF',
				ntpServer: 'https://iot.wumei.live'
			},
			actions: [
				{
					name: '男'
				},
				{
					name: '女'
				},
				{
					name: '保密'
				}
			],
			rules: {
				deviceNum: {
					type: 'string',
					required: true,
					message: '请填写设备编号',
					trigger: ['blur', 'change']
				}
			}
		};
	},
	methods: {}
};
</script>

<style lang="scss">
page {
	background: #eef3f7;
}
.container {
	padding-bottom: 100px;
}

.button-content {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	padding:10px;
}
.button-item {
	margin: 0 15px 15px 0;
}
</style>
