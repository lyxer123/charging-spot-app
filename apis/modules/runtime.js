const http = uni.$u.http;

// 发送设备实时数据
export function postServiceInvoke (data) {
	return http.post('/iot/runtime/service/invoke', data);
}