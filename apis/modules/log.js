const http = uni.$u.http;

// 查询指令日志列表
export function getOrderLogList (query) {
	return http.request({
		url: '/iot/log/list',
		method: 'get',
		params: query
	})
}