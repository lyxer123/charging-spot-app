import projectConfig from '@/env.config.js';

var mqtt = require('mqtt/dist/mqtt.min.js')
var url = projectConfig.mqttServer;

let mqttTool = {
	client: null
}

mqttTool.connect = function (token) {
	let options = {
		clientId: 'phone-' + Math.random().toString(16).substr(2),
		username: 'fastbee',
		password: token,
		cleanSession: true,
		keepalive: 30,
		connectTimeout: 60000,
	};
	mqttTool.client = mqtt.connect(url, options);
	// 连接成功
	mqttTool.client.on('connect', function (res) {
		console.log('mqtt连接成功');
	});
	// 重新连接
	mqttTool.client.on('reconnect', function (res) {
		console.log('mqtt重连');
	});
	// 发生错误
	mqttTool.client.on('error', function (err) {
		console.log('mqtt连接错误:', err);
		uni.showToast({
			icon: 'none',
			title: 'mqtt连接错误',
		});
	});
	// 断开连接
	mqttTool.client.on('close', function (res) {
		console.log('mqtt断开连接');
	});
}

mqttTool.end = function () {
	return new Promise((resolve, reject) => {
		if (mqttTool.client == null) {
			resolve('未连接')
			console.log("未连接")
			return;
		}
		mqttTool.client.end()
		mqttTool.client = null
		resolve('连接终止')
	})
}

mqttTool.reconnect = function () {
	return new Promise((resolve, reject) => {
		if (mqttTool.client == null) {
			// 调用resolve方法，Promise变为操作成功状态（fulfilled）
			resolve('未连接')
			console.log("未连接")
			return;
		}
		console.log('正在重连...', res);
		mqttTool.client.reconnect()
	})
}

mqttTool.subscribe = function (topics) {
	return new Promise((resolve, reject) => {
		if (mqttTool.client == null) {
			resolve('未连接')
			console.log("未连接")
			uni.showToast({
				icon: 'none',
				title: 'mqtt未连接',
			});
			return;
		}
		mqttTool.client.subscribe(topics, {
			qos: 0
		}, function (err, res) {
			console.log("订阅主题：", topics);
			if (!err && res.length > 0) {
				console.log("订阅成功")
				resolve('订阅成功')
			} else {
				console.log("订阅失败，主题可能已经订阅")
				resolve('订阅失败')
				return;
			}
		})
	})
}

mqttTool.unsubscribe = function (topics) {
	return new Promise((resolve, reject) => {
		if (mqttTool.client == null) {
			resolve('未连接')
			console.log("未连接")
			return;
		}
		mqttTool.client.unsubscribe(topics, function (err) {
			if (!err) {
				resolve('取消订阅成功')
				console.log("取消订阅成功")
			} else {
				resolve('取消订阅失败')
				console.log("取消订阅失败")
				return;
			}
		})
	})
}

mqttTool.publish = function (topic, message, name) {
	return new Promise((resolve, reject) => {
		if (mqttTool.client == null) {
			resolve('未连接')
			console.log("未连接")
			uni.showToast({
				icon: 'none',
				title: '已断开Mqtt连接',
			});
			return;
		}
		mqttTool.client.publish(topic, message, function (err) {
			if (!err) {
				resolve(topic + '-' + message + '-发布成功')
				console.log('发布主题：' + topic + "，内容：" + message);
				uni.showToast({
					icon: 'none',
					title: "[ " + name + " ] 指令发送成功",
					duration: 1000,
				});
			} else {
				resolve(topic + '-' + message + '-发布失败')
				console.log("发布失败")
				uni.showToast({
					icon: 'none',
					title: "[ " + name + " ] 指令发送失败",
					duration: 1000,
				});
				return;
			}
		})
	})
}

export default mqttTool