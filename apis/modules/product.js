const http = uni.$u.http;

// 查询产品列表
export function listProductShort (params) {
	return http.get('/iot/product/list', {
		params
	});
}