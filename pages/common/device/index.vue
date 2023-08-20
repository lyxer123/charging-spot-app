<template>
	<page-meta>
		<navigation-bar title="设备列表" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="charge__wrapper">
		<view class="charge__container">
			<u-empty mode="data" v-if="list.length == 0"></u-empty>
			<template v-else>
				<view class="charge__card" @click.native.stop="handleGoDetail(item.deviceId)" v-for="item in list" :key="item.deviceId">
					<u--text :text="item.deviceName" lines="1" :bold="true" :size="16"></u--text>
					<!-- <view class="charge-no">
						<u--text :text="`编号：${item.serialNumber}`" lines="1" :size="12" color="#ccc"></u--text>
					</view> -->
					<view class="charge-product">
						<u--text :text="`产品：${item.productName}`" lines="1" :size="12" color="#ccc"></u--text>
					</view>
					<u-line color="#ccc"></u-line>
					<view class="info__wrapper">
						<view class="btn__wrapper">
							<u-button v-if="item.showButton" type="primary" size="mini" @click.native.stop="handleScanCode(item.productId)">扫码充电</u-button>
							<u-button v-else type="primary" size="mini">其他用户使用中</u-button>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" />
			</template>
		</view>
	</view>
</template>

<script>
import {listDeviceShort} from '@/apis/modules/device.js';
import {
	startCharge,
	stopCharge
} from '@/apis/modules/charge.js';
export default {
	data() {
		return {
			list: [],
			status: 'loadmore',
			chargeStatus: false, // true充电中
			productId: '',
			serialNumber: '',
			iconStyle: {
				fontSize: '10px',
				color: '#007aff'
			},
			total: 0,
			pager: {
				pageNum: 1,
				pageSize: 20
			}
		}
	},
	onLoad(option) {
		this.productId = option?.productId || '';
		this.fetchDeviceList()
	},
	onReachBottom() {
		this.loadMore()
	},
	methods: {
		loadMore() {
			if (this.list.length >= this.total) return;
			this.status = 'loading';
			this.pager.pageNum = ++this.pager.pageNum;
			this.fetchDeviceList()
		},
		fetchDeviceList() {
			uni.showLoading({
				title: '加载中...'
			})
			listDeviceShort({...this.pager, productId: this.productId})
				.then(res=> {
					if (res.code == 200) {
						this.total = res.total;
						this.list =  [...this.list, ...res.rows];
						if (this.list.length < this.total) {
							this.status = 'loadmore'
						} else if (this.list.length >= this.total) {
							this.status = 'nomore'
						}
					}
				}).finally(()=> {
					uni.hideLoading()
				})
		},
		handleGoDetail(id = '') {
			uni.$u.route({
				url: '/pages/common/device/detail',
				params: {
					deviceId: id
				}
			})
		},
		handleScanCode(productId) {
			const _this = this;
			uni.scanCode({
				success(res) {
					if (res.errMsg == 'scanCode:ok') {
						const result = JSON.parse(res.result);
						// this.serialNumber = res.rawData;
						uni.showModal({
							title: '提示',
							content: '是否启动充电？',
							confirmText: '启动',
							confirmColor: '#007aff',
							success(res1) {
								if (res1.confirm) {
									const params = {
										productId: result.productId,
										serialNumber: result.serialNumber
									};
									_this.fetchStartCharge(params)
								} else if (res1.cancel) {
									
								}
							}
						})
					}
					
				}
			})
		},
		fetchStartCharge(params) {
			uni.showLoading({
				title: '启动中...'
			})
			startCharge(params)
				.then(res=> {
					if (res.code == 200) {
						// 成功
						uni.showToast({
							title: res.msg || ''
						})
					} else {
						uni.showToast({
							title: res.msg || '',
							icon: 'none',
							duration: 3000
						})
					}
				}).finally(()=> {
					uni.hideLoading();
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
							productId: option.productId,
							serialNumber: option.serialNumber
						};
						stopCharge(params)
							.then(res=> {
								console.log('stop,', res)
							})
					} else if (res1.cancel) {
						
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.charge {
		&-title {
			flex: 1;
			margin-left: 20rpx;
		}
		&-no {
			margin: 20rpx 0;
		}
		&-product {
			margin-bottom: 20rpx;
		}
		&__wrapper {
			background: #eef3f7;
		}
		&__container {
			padding: 20rpx 30rpx;
		}
		&__card {
			padding: 20rpx;
			margin-bottom: 20rpx;
			background-color: #fff;
			border-radius: 6rpx;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;
			box-shadow: 6rpx 6rpx 4rpx #eee;
			&:last-child {
				margin-bottom: 0;
			}
			.info__wrapper {
				width: 100%;
				padding-top: 10px;
				display: flex;
				justify-content: flex-end;
			}
		}
		&-title {
			
		}
		&-price {
			font-weight: 700;
			padding: 10rpx 0;
			color: $uni-color-primary;
		}
		
	}
</style>