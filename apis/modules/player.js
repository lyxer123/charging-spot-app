//播放器
const http = uni.$u.http;
export function startPlay(deviceId, channelId) {
    return http.get('/sip/player/play/' + deviceId + "/" + channelId);
}

export function stopPlay(deviceId, channelId, streamId) {
    return http.get('/sip/player/playstop/' + deviceId + "/" + channelId);
}

export function playback(deviceId, channelId, query) {
    return http.get('/sip/player/playback/' + deviceId + "/" + channelId,{params: query});
}

export function playbackStop(deviceId, channelId, streamId) {
    return http.get('/sip/player/playbackStop/' + deviceId + "/" + channelId + "/" + streamId);
}

export function playbackPause(deviceId, channelId, streamId) {
    return http.get('/sip/player/playbackPause/' + deviceId + "/" + channelId + "/" + streamId);
}

export function playbackReplay(deviceId, channelId, streamId) {
    return http.get('/sip/player/playbackReplay/' + deviceId + "/" + channelId + "/" + streamId);
}

export function playbackSeek(deviceId, channelId, streamId, query) {
    return http.get('/sip/player/playbackSeek/' + deviceId + "/" + channelId + "/" + streamId,{params: query});
}

export function playbackSpeed(deviceId, channelId, streamId, query) {
    return http.get('/sip/player/playbackSpeed/' + deviceId + "/" + channelId + "/" + streamId,{params: query});
}

// record
export function getDevRecord(deviceId,channelId,query) {
    return http.get('/sip/record/devquery/' + deviceId + "/" + channelId,{params: query});
}

export function getRecord(channelId,sn) {
    return http.get('/sip/record/query/' + channelId + "/" + sn);
}
