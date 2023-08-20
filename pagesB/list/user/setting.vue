<template>
	<page-meta><navigation-bar title="系统设置" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view style="background-color:#fff;padding:10px;margin-bottom:10px;padding-bottom:80px;">
			<text style="font-size:14px;color:#999">系统配置</text>
			<u--form labelPosition="left" labelWidth="120" :model="config" ref="form1">
				<u-form-item label="服务端地址:" prop="firmwareVersion" borderBottom leftIcon="tags">
					<u-input v-model="config.serverUrl" border="none" readonly>
						<u-button type="success" slot="suffix" text="测试" size="small" customStyle="width:50px;margin-left:10px;" disabled></u-button>
					</u-input>
				</u-form-item>
				<u-form-item label="设备状态重置" prop="ntpServer" leftIcon="tags">
					<u-button type="error" text="重置" size="small" customStyle="width:50px;margin-left:10px;"></u-button>
				</u-form-item>
				<u-form-item label="Mqtt重连" prop="ntpServer" leftIcon="tags">
					<u-button type="primary" text="重连" size="small" customStyle="width:50px;margin-left:10px;"></u-button>
				</u-form-item>
			</u--form>
			<!-- <u-button text="测试服务端配置" type="error" customStyle="margin-top:50px;"></u-button> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			config: {
				isReset: false,
				serverUrl: 'https://iot.wumei.live'
			}
		};
	},
	methods: {}
};
</script>

<style>
page {
	background: #eef3f7;
}
.container {
}
</style>
