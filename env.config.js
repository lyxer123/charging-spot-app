// H5端开发和生产环境协议
let protocalDev = "wss://";
let protocalProd = "wss://";

// 条件编译，微信端和移动端使用wxs协议
// #ifdef MP-WEIXIN || APP-PLUS
protocalDev = 'wxs://';
protocalProd = 'wxs://';
// #endif


const CONFIG = {
	// 开发环境配置
	development: {
		officialWebUrl: 'https://fastbee.cn/',
		baseUrl: 'https://iot.wumei.live/prod-api/',
		mqttServer: protocalDev + 'iot.fastbee.cn/mqtt',
	},
	// 生产环境配置
	production: {
		officialWebUrl: 'https://fastbee.cn/',
		baseUrl: 'https://iot.wumei.live/prod-api/',
		mqttServer: protocalProd + 'iot.fastbee.cn/mqtt',
	}
}
export default CONFIG[process.env.NODE_ENV];