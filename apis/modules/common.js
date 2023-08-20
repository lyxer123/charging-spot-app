const http = uni.$u.http;

// 查询所有产品列表
export function listShortProduct () {
	return http.get('/iot/product/shortList');
}

// 获取验证码
export function captchaImage () {
	return http.get('/captchaImage');
}

// 获取用户信息
export function getProfile () {
	return http.get('/system/user/profile');
}

// 登录
export function login (params) {
	return http.post('/login', params);
}

// 退出登录
export function logout () {
	return http.post('/logout');
}

// 注册方法
export function register (params) {
	return http.post('/iot/tool/register', params);
}

// 查询用户列表
export function listUser (params) {
	return http.get('/iot/tool/userList', { params: params });
}

// 注销账号
export function unsubscribe () {
	return http.post('/unsubscribe');
}