import * as common from './modules/common.js';
import * as scene from './modules/scene.js';
import * as group from './modules/group.js';
import * as deviceUser from './modules/deviceUser.js';
import * as deviceLog from './modules/deviceLog.js';
import * as device from './modules/device.js';
import * as deviceJob from './modules/deviceJob.js';
// const http = uni.$u.http;

// api 接口管理
const install = (Vue, vm) => {

	Vue.prototype.$api  = {
		// 登录
		// login:(params = {})=>http.post('/login',params),

		// import modules 
		common,
		scene,
		group,
		deviceUser,
		deviceLog,
		device,
		deviceJob
	};
}

export default {
	install
}
