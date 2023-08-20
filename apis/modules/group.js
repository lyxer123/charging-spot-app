const http = uni.$u.http;

// 查询设备分组列表
export function listGroup(query) {
  return http.request({
    url: '/iot/group/list',
    method: 'get',
    params: query
  })
}

// 查询设备分组详细
export function getGroup(groupId) {
  return http.request({
    url: '/iot/group/' + groupId,
    method: 'get'
  })
}

// 新增设备分组
export function addGroup(data) {
  return http.request({
    url: '/iot/group',
    method: 'post',
    data: data
  })
}

// 修改设备分组
export function updateGroup(data) {
  return http.request({
    url: '/iot/group',
    method: 'put',
    data: data
  })
}

// 更新分组下的设备
export function updateDeviceGroups(data) {
  return http.request({
    url: '/iot/group/updateDeviceGroups',
    method: 'put',
    data: data
  })
}

// 删除设备分组
export function delGroup(groupId) {
  return http.request({
    url: '/iot/group/' + groupId,
    method: 'delete'
  })
}

// 查询分组下的关联设备ID数组
export function getDeviceIds(groupId) {
  return http.get('/iot/group/getDeviceIds/' + groupId);
}