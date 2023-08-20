<template>
	<page-meta>
		<navigation-bar title="订单详情" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="order-detail-page">
		<view class="detail__body">
			<view class="order-name">
				<u--text :text="detail.name" bold="700" size="18" line="2" align="center"></u--text>
			</view>
			<view class="price">
				<u--text prefixIcon="rmb" :text="detail.money" lines="1" :bold="true" :size="16" type="primary" :iconStyle="iconStyle" align="center"></u--text>
			</view>
			<u-line></u-line>
			<view class="info__wrapper">
				<u-row :gutter="10">
					<u-col :span="4">
						<u--text text="当前状态" color="#999" size="14"></u--text>
					</u-col>
					<u-col :span="8">
						<u--text color="#333" size="14" :text="detail.status | status"></u--text>
					</u-col>
				</u-row>
				<u-row :gutter="10">
					<u-col :span="4">
						<u--text text="订单时间" color="#999" size="14"></u--text>
					</u-col>
					<u-col :span="8">
						<u--text color="#333" size="14" :text="detail.createTime"></u--text>
					</u-col>
				</u-row>
			</view>
		</view>
	</view>
	<view class="bar-bottom">
		<view class="scan-btn">
			<u-button v-if="detail.status == 0" type="primary" text="去支付" @click="handlePay(detail)"></u-button>
			<u-button v-else-if="[1].includes(detail.status)" type="primary" text="停止充电" @click.native.stop="handleStopCharge(detail)"></u-button>
			<u-button v-else-if="[2, 3].includes(detail.status)" type="info" text="删除订单"  @click.native.stop="handleDelete(detail.id)"></u-button>
			<!-- <u-button v-else type="primary" @click.native.stop="handleStopCharge(item)">充电中...</u-button> -->
		</view>
	</view>
</template>

<script>
	import {
		getRecord,
	} from '@/apis/modules/order.js';
	import chargeMixin from './charge.js';
	export default {
		mixins: [chargeMixin],
		data() {
			return {
				orderId: '',
				detail: {},
				iconStyle: {
					fontSize: '10px',
					color: '#007aff'
				},
			}
		},
		filters: {
			status(val) {
				// 0.待支付 1.进行中 2.已完成 3.已取消"
				return ['待支付', '进行中', '已完成','已取消'][val]
			}
		},
		onLoad(option) {
			this.orderId = option?.id || '';
			this.fetchDetail()
		},
		methods: {
			fetchDetail() {
				uni.showLoading({});
				getRecord(this.orderId)
					.then(res=> {
						if (res.code == 200) {
							this.detail = res.data
						}
					}).finally(()=> {
						uni.hideLoading()
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scan-btn {
		width: 70%;
	}
	.order-detail-page {
		padding-bottom: 150rpx;
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
	.info__wrapper {
		margin-top: 30rpx;
	}
	.price {
		margin: 30rpx auto 50rpx;
	}
	.detail__body {
		margin: 20rpx 30rpx;
		background-color: #fff;
		padding: 30rpx;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
