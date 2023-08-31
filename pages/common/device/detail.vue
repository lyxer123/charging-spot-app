<template>
	<page-meta>
		<navigation-bar title="设备详情" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="charge-detail__wrapper">
		<view class="detail-card">
			<!-- <view class="image__wrapper">
				<u-swiper
					:list="list3"
					indicator
					indicatorMode="line"
					circular
				></u-swiper>
				<u--image src="https://cdn.uviewui.com/uview/album/1.jpg" width="100%">
					<template v-slot:loading>
						<u-loading-icon></u-loading-icon>
					</template>
				</u--image>
			</view> -->
			<view class="name__wrapper">
				<u--text :text="detail.deviceName" lines="2" :bold="true" :size="16"></u--text>
			</view>
			<view class="other__wrapper">
				<!-- <view class="charge-no">
					<u--text :text="`设备编号：${detail.serialNumber}`" lines="1" :size="12" color="#ccc"></u--text>
				</view> -->
				<view class="charge-product">
					<u--text :text="`所属产品：${detail.productName}`" lines="1" :size="12" color="#ccc"></u--text>
				</view>
				<u--text :text="`其他：${detail.remark || '--'}`" lines="2" :size="12" color="#ccc"></u--text>
				<!-- <u--text prefixIcon="clock" iconStyle="font-size: 12px" :size="12" text="营业时间: 00:00-24:00" type="info" ></u--text> -->
			</view>
		</view>
		<view class="detail-card">
			<u--text text="价格信息" :bold="true" :size="13"></u--text>
			<template v-if="detail.elcTpl && detail.elcTpl.elcPriceList ">
				<view class="current-price" v-for="(item, index) in detail.elcTpl.elcPriceList || []" :key="index">
					<text class="current-date u-font-size">{{item | format-date}}</text>
					<u--text :text="item.price" lines="1" :bold="true" :size="16" type="primary" :iconStyle="iconStyle" mode="price"></u--text>
				</view>
			</template>
		</view>
		<view class="bar-bottom">
			<view class="scan-btn">
				<!-- <u-button type="primary" text="扫码充电" @click="handleScan"></u-button> -->
				<u-button v-if="isNotUse" type="primary" text="扫码充电" @click="handleScan"></u-button>
				<u-button v-else disabled text="设备使用中"></u-button>
				<!-- <u-button v-else type="primary" @click.native.stop="handleStopCharge(item)">充电中...</u-button> -->
			</view>
		</view>
	</view>
</template>

<script>
	import { getDevice } from '@/apis/modules/device.js';
	import {
		startCharge,
		stopCharge
	} from '@/apis/modules/charge.js';
	export default {
		data() {
			return {
				isNotUse: true,
				show: false,
				result: null,
				currentTime: '',
				chargeState: false,
				detail: {},
				deviceId: '',
				iconStyle: {
					fontSize: '10px',
					color: '#007aff'
				},
			}
		},
		onLoad(option) {
			this.deviceId = option?.deviceId|| '';
			this.isNotUse = option?.isNotUse == 'false' ? false : true;
			this.fetchDetail()
		},
		filters: {
			formatDate(val) {
				let start = new Date(val.startTime);
				let end = new Date(val.endTime)
				let sHour = start.getHours().toString().padStart(2, '0');
				let sMin = start.getMinutes().toString().padStart(2, '0');
				let eHour = end.getHours().toString().padStart(2, '0');
				let eMin = end.getMinutes().toString().padStart(2, '0');
				return `${sHour}:${sMin}-${eHour}:${eMin}`
			}
		},
		methods: {
			fetchDetail() {
				if (!this.deviceId) return;
				uni.showLoading({
					title: '加载中...'
				})
				getDevice(this.deviceId)
					.then(res=> {
						if (res.code == 200) {						
							this.detail = res.data
						}
					}).finally(()=> {
						uni.hideLoading()
					})
			},
			handleScan() {
				const _this = this;
				uni.scanCode({
					success(res) {
						if (res.errMsg == 'scanCode:ok') {
							const result = JSON.parse(res.result);
							this.result = result;
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
				// uni.showLoading({
				// 	title: '启动中...'
				// })
				startCharge(params)
					.then(res=> {
						if (res.code == 200) {
							// 成功
							uni.showToast({
								title: res.msg || '',
								icon: 'none',
								duration: 5000
							})
						} else {
							uni.showToast({
								title: res.msg || '',
								icon: 'none',
								duration: 5000
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
								productId: this.result?.productId,
								serialNumber: this.result?.serialNumber
							};
							stopCharge(params)
								.then(res=> {
									console.log('stop,', res)
								})
						} else if (res1.cancel) {
							
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.charge-no {
		margin-bottom: 20rpx;
	}
	.scan-btn {
		width: 70%;
	}
	.bar-bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 140rpx;
		background-color: #fff;
		// border-top: 0.5rpx solid $uni-border-color;
	}
	.current-date {
		font-size: 12px;
		color: $uni-font-ccc;
		padding: 10rpx 22rpx;
		border-radius: 11rpx;
		margin-right: 20rpx;
		background-color: $uni-bg-color-grey;
	}
	.current-price {
		display: flex;
		margin: 30rpx 0 10rpx 0;
	}
	.charge-detail__wrapper {
		padding: 20rpx 30rpx;
	}
	.detail-card {
		background-color: #fff;
		border-radius: 8rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}
	.image__wrapper {

	}
	.name__wrapper {
		margin: 10rpx 0;
	}

</style>
