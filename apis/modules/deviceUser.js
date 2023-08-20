const http = uni.$u.http;

// 查询设备用户列表
export function listDeviceUser(params) {
  return http.get('/iot/deviceUser/list',{params:params});
}

// 查询设备用户详细
export function getDeviceUser(deviceId) {
  return http.get( '/iot/deviceUser/' + deviceId)
}

// 新增设备用户
export function addDeviceUser(data) {
  return http.post('/iot/deviceUser',data);
}

// 修改设备用户
export function updateDeviceUser(data) {
  return http.put('/iot/deviceUser',data)
}

// 删除设备用户
export function delDeviceUser(device) {
  return http.delete('/iot/deviceUser',device)
}