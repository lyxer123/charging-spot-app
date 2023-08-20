const http = uni.$u.http;

// 查询公告列表
export function listNotice(params) {
  return http.get('/system/notice/list',{params})
}

// 查询公告详情
export function getNotice(noticeId) {
  return http.get('/system/notice/' + noticeId);
}