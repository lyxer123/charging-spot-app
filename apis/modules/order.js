const http = uni.$u.http;

// 查询订单列表
export function listRecord(params) {
	return http.get('/order/info/list', {
		params
	});
}

// 查询订单详情
export function getRecord(id) {
	return http.get(`/order/info/${id}`);
}

// 删除订单
export function delRecord(id) {
	return http.delete(`/order/info/${id}`);
}

// 查询未支付的订单
export function getUnPayRecord() {
	return http.get('/order/info/needPay')
}