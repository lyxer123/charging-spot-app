const http = uni.$u.http;

// 查询场景联动列表
export function listScene(query) {
  return http.get('/iot/scene/list',{params:query});
}

// 查询场景联动详细
export function getScene(sceneId) {
  return http.get('/iot/scene/' + sceneId);
}

// 新增场景联动
export function addScene(data) {
  return http.post('/iot/scene',data);
}

// 修改场景联动
export function updateScene(data) {
  return http.put('/iot/scene',data);
}

// 删除场景联动
export function delScene(sceneId) {
  return http.delete('/iot/scene/' + sceneId);
}

//获取设备列表
export function deviceShortList(params) {
  return http.get('/iot/device/shortList',{params});
}

//根据设备id获取下拉选项数据
export function modelCache(deviceId) {
  return http.get('/iot/model/cache/' + deviceId);
}