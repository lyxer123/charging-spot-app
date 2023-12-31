// H5端开发和生产环境协议
let protocalDev = "wss://";
let protocalProd = "wss://";

// 条件编译，微信端和移动端使用wxs协议
// #ifdef MP-WEIXIN || APP-PLUS
protocalDev = 'wxs://';
protocalProd = 'wxs://';
// #endif


const CONFIG = {
	development: {
		officialWebUrl: 'https://fastbee.cn/',
		baseUrl: 'https://pay.bldxny.com/prod-api',
		mqttServer: protocalProd + '47.108.226.28:8083/mqtt',
	},
	// 开发环境配置
	// development: {
	// 	officialWebUrl: 'https://fastbee.cn/',
	// 	baseUrl: 'https://api.lmnml.cn/api',
	// 	mqttServer: protocalDev + 'ws.emqx.lmnml.cn:8083/mqtt',
	// },
	// 生产环境配置
	production: {
		officialWebUrl: 'https://fastbee.cn/',
		baseUrl: 'https://pay.bldxny.com/prod-api',
		mqttServer: protocalProd + '47.108.226.28:8083/mqtt',
	},
}
export default CONFIG[process.env.NODE_ENV];