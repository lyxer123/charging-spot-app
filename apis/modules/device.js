const http = uni.$u.http;

// 查询设备简短列表
export function listDeviceShort (params) {
	return http.get('/iot/device/shortList', {
		params: params
	});
}

// 查询设备详细
export function getDevice (deviceId) {
	return http.get('/iot/device/' + deviceId);
}

// 设备数据同步
export function deviceSynchronization (serialNumber) {
	return http.get('/iot/device/synchronization/' + serialNumber);
}

// 查询设备运行状态详细
export function getRunningStatus (deviceId, slaveId, type, productId, serialNumber) {
	let params = {
		deviceId: deviceId,
		slaveId: slaveId,
		type: type,
		productId: productId,
		serialNumber: serialNumber,

	};
	return http.get('/iot/device/runningStatus', {
		params: params
	});
}

// 查询设备物模型的值
export function getDeviceThingsModelValue (deviceId) {
	return http.get('/iot/device/thingsModelValue/' + deviceId);
}

// 根据产品ID获取缓存的物模型
export function cacheJsonThingsModel (productId) {
	return http.get('/iot/model/cache/' + productId, {
		custom: {
			ShowLoading: false
		}
	});
}

// 根据产品ID获取缓存的物模型
export function getCacheThingsModel (productId) {
	return http.get('/iot/model/cache/' + productId);
}

// 修改设备
export function updateDevice (data) {
	return http.put('/iot/device', data)
}

// 用户关联设备
export function deviceRelateUser (data) {
	return http.post('/iot/device/relateUser', data)
}

// 删除设备
export function delDevice (deviceId) {
	return http.delete('/iot/device/' + deviceId);
}

// 查询设备最新固件
export function getLatestFirmware (deviceId) {
	return http.get('/iot/firmware/getLatest/' + deviceId);
}

// 查询分组可添加设备分页列表
export function listDeviceByGroup (query) {
	return http.get('/iot/device/listByGroup', {
		params: query
	})
}