const http = uni.$u.http;

// 查询动态
export function topListTrend() {
  return http.get('/iot/news/topList')
}

// 查询轮播广告图
export function bannerListTrend() {
  return http.get('/iot/news/bannerList')
}

// 查询分类下动态
export function listTrend(params) {
  return http.get('/iot/news/list',{params})
}

// 查询动态详情
export function getTrend(newsId) {
	console.log("newsId")
	console.log(newsId)
  return http.get('/iot/news/' + newsId);
}