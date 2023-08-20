// sipchannel
// 查询监控设备通道信息列表
const http = uni.$u.http;

export function listChannel(query) {
    return http.request({
	  url: '/sip/channel/list',
	  method: 'get',
	  params: query
	});
}

// 查询监控设备通道信息详细
export function getChannel(channelId) {
    return http.get('/sip/channel/' + channelId);
}

// 新增监控设备通道信息
export function addChannel(createNum, data) {
    return http.post('/sip/channel/'+ createNum,data);
}

// 修改监控设备通道信息
export function updateChannel(data) {
    return http.put('/sip/channel',data)
}

// 删除监控设备通道信息
export function delChannel(channelId) {
    return http.delete('/sip/channel/'+ channelId)
}

// ptz控制
export function ptzdirection(deviceId,channelId,data) {
    return http.post('/sip/ptz/direction/'+ deviceId + "/" + channelId,data);
}

export function ptzscale(deviceId,channelId,data) {
    return http.post('/sip/ptz/scale/'+ deviceId + "/" + channelId,data);
}
