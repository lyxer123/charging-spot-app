import {
	stopCharge
} from '@/apis/modules/charge.js';
import {
		listRecord,
		delRecord
	} from '@/apis/modules/order.js';
export default {
	methods: {
		handleDelete(id) {
			const _this = this;
			uni.showModal({
				title: '提示',
				content: '是否删除该订单？',
				confirmText: '确定',
				confirmColor: '#007aff',
				success(res) {
					if (res.confirm) {
						_this.fethDelete(id)
					}
				}
			})
		},
		fethDelete(id) {
			uni.showLoading({
				title:'删除中...'
			})
			delRecord(id)
				.then(res=> {
					if (this.fetchList) {
						this.fetchList();
					}
				}).finally(()=> {
					uni.hideLoading()
				})
		},
		handleStopCharge(option) {
			uni.showModal({
				title: '提示',
				content: '是否停止充电？',
				confirmText: '停止',
				confirmColor: '#007aff',
				success(res1) {
					if (res1.confirm) {
						const params = {
							productId: option?.productId,
							serialNumber: option?.serialNumber
						};
						uni.showLoading({
							title: '停止中...'
						})
						stopCharge(params)
							.then(res=> {
								if (res.code != 200 ) {
									setTimeout(()=> {
										uni.showToast({
											icon: 'none',
											duration: 2500,
											title: res.msg || '请求出错！'
										})
									}, 20)
								}
							}).finally(()=> {
								uni.hideLoading()
							})
					} else if (res1.cancel) {
						
					}
				}
			})
		},
	}
}