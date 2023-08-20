const http = uni.$u.http;

// 扫码启动充电
export function startCharge (params) {
	return http.post('/order/info/start', params);
}

// 停止充电
export function stopCharge (params) {
	return http.post('/order/info/stop', params);
}