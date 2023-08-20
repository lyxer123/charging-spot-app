<template>
	<page-meta><navigation-bar title="手机监控" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view style="background-color:#fff;padding:10px;margin-bottom:10px;">
			<text style="font-size:14px;color:#999">功能</text>
			<u--form labelPosition="left" labelWidth="100" :model="device" :rules="rules" ref="form1">
				<u-form-item label="拨打电话" prop="deviceNum" borderBottom leftIcon="tags"><u--input  border="none"></u--input></u-form-item>
				<u-form-item label="屏幕亮度" prop="firmwareVersion" borderBottom leftIcon="tags"><u--input  border="none"></u--input></u-form-item>
				<u-form-item label="震动" prop="userId" borderBottom leftIcon="tags"><u--input  border="none"></u--input></u-form-item>
				<u-form-item label="蓝牙" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
				<u-form-item label="拍照" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
				<u-form-item label="录音" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
				<u-form-item label="视频" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
			</u--form>
		</view>
	
		<view style="background-color:#fff;padding:10px;margin-bottom:10px;">
			<text style="font-size:14px;color:#999">属性</text>
			<u--form labelPosition="left" labelWidth="100" :model="device" :rules="rules" ref="form2">
				<u-form-item label="设备信息" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
				<u-form-item label="加速指针" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
				<u-form-item label="陀螺仪" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
				<u-form-item label="罗盘" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
			</u--form>
		</view>
	
		<view style="background-color:#fff;padding:10px;margin-bottom:10px;">
			<text style="font-size:14px;color:#999">事件</text>
			<u--form labelPosition="left" labelWidth="100" :model="device" :rules="rules" ref="form3">
				<u-form-item label="内存不足" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
				<u-form-item label="网络变化" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
				<u-form-item label="用户截屏" prop="ntpServer" borderBottom leftIcon="tags"><u--input border="none"></u--input></u-form-item>
			</u--form>
		</view>
	
		<view class="button-content">
			<u-button text="确定" type="primary" customStyle="margin-bottom:20px;"></u-button>
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
