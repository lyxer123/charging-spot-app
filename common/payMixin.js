import projectConfig from '@/env.config.js';
// import {
// 	getUnPayRecord
// } from '@/apis/modules/order.js';
export default {
	data() {
		return {
			unAmount: 0,
			orderId: '',
		}
	},
	onLoad(option) {
		console.log('option', option)
		this.unAmount = option?.amount || 0;
		this.orderId = (option?.orderId == 'undefined' || !option?.orderId) ? '' : option?.orderId;
		const page = getCurrentPages();
		if (page.length) {
			const route = page[page.length - 1].route;
			const token = uni.getStorageSync('token');
			if (route != 'pages/common/pay/index' && route !== 'pages/login') {
				if (token) {
					this.fetchUnPay(token)
				}
			}
		}
		
	},
	methods: {
		wxLogin(option) {
			const _this = this;
			const token = uni.getStorageSync('token');
			uni.getProvider({
				service: 'oauth',
				success(res) {
					if (res.errMsg == 'getProvider:ok') {
						let provider = res.provider[0];
						uni.setStorageSync('provide', provider);
						uni.login({
							provider,
							onlyAuthorize: true,
							success(data) {
								if (data.errMsg == 'login:ok') {
									const code = data.code;
									// 通过后台换取openId
									uni.request({
										url:`${projectConfig.baseUrl}/order/info/getOpenid/${code}`,
										header: {
											Authorization : `Bearer ${token}`
										},
										success(res) {
											if (res.statusCode == 200) {
												if (res.data.code == 200) {
													console.log(res)
													let openId = res.data.msg;
													uni.setStorageSync('openId', openId);
													_this.fetchPay({...option,openId})
												} else if (res.data.code == 401) {
													uni.redirectTo({
														url: '/pages/login'
													})
												} else {
													uni.showToast({
														icon: 'none',
														title: res.data.msg || '请求出错'
														
													})
												}
											}
										}
									})
								}
							}
						})
					}
				}
			})
		},
		fetchPay(option) {
			const token = uni.getStorageSync('token');
			const id = option.id || this.orderId || '';
			if (!id) {
				uni.showToast({
					icon: 'none',
					title: '请求出错，请刷新页面重试'
				})
				return
			};
			uni.request({
				url: `${projectConfig.baseUrl}/order/info/goPay/${id}/${option?.openId}`,
				header: {
					Authorization : `Bearer ${token}`
				},
				success(res) {
					console.log(res)
					if (res.statusCode == 200) {
						if (res.data.code == 200) {
							// appId:小程序id
							// timestamp:时间戳
							// nonceStr:随机字符串
							// package:包
							// signType:类型
							// paySign:支付签名
							const {
								appId,
								timeStamp,
								nonceStr,
								packageVal,
								signType,
								paySign
							} = res.data.data;
							uni.getProvider({
								service: 'payment',
								success(res) {
									if (res.errMsg == 'getProvider:ok') {
										let provider = res.provider[0];
										console.log(999999,{
												appId,
												timeStamp,
												nonceStr,
												package: packageVal,
												signType,
												paySign
											})
										uni.requestPayment({
											provider,
											timeStamp,
											nonceStr,
											package: packageVal,
											signType,
											paySign,
											// orderInfo: {
											// 	appId,
											// 	timeStamp,
											// 	nonceStr,
											// 	package: packageVal,
											// 	signType,
											// 	paySign
											// },
											success() {
												console.log('zhifuchengg')
												uni.switchTab({
													url: '/pages/tabBar/home/home'
												})
											},
											complete(res) {
												console.log(res)
											}
										})
									}
								}
							})
						} else if (res.data.code == 401) {
							uni.redirectTo({
								url: '/pages/login'
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg || '请求出错'
								
							})
						}
					}
				}
			})
		},
		handlePay(option = {}) {
			// this.wxLogin()
			const openId = uni.getStorageSync('openId');
			if(!openId) {
				this.wxLogin(option)
			} else {
				this.fetchPay({
					...option,
					openId
				})
			}
			
		},
		fetchUnPay(token) {
			uni.request({
				url: `${projectConfig.baseUrl}/order/info/needPay`,
				header: {
					Authorization : `Bearer ${token}`
				},
				success(res) {
					if (res.statusCode == 200) {
						if (res.data.code == 200) {
							if (res.data.data.needPay) {
								uni.redirectTo({
									url: `/pages/common/pay/index?amount=${res.data.data.money}&orderId=${res.data.data.id}`
								})
							} else {
								// uni.redirectTo({
								// 	url: `/pages/common/pay/index?amount=${res.data.data.money}&orderId=${res.data.data.orderId}`
								// })
							}
						}	
						else if (res.data.code == 401) {
							uni.redirectTo({
								url: '/pages/login'
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg || '请求出错'
								
							})
						}
					}
				}
			})
		}
	}
}