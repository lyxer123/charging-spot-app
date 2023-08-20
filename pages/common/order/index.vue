<template>
	<page-meta>
		<navigation-bar title="我的订单" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="order-page">
		<u-sticky bgColor="#fff">
		   <u-tabs :list="tabsList" keyName="label" :current="currentTab" @change="listenTabChange" :scrollable="false"></u-tabs>
		</u-sticky>
		<view class="order__wrapper">
			<view class="order__outter" @click.stop="handleDetail(item.id)" v-for="item in list" :key="item.id">
				<view class="order-no">	
					<u--text :text="`订单编号:${item.id} `" color="#333" size="14"></u--text>
					<text class="order-status">{{ item.status | status}}</text>
				</view>
				<view class="order-price">
					<view>
						<u--text prefixIcon="rmb" :text="item.money" lines="1" :bold="true" :size="16" type="primary" :iconStyle="iconStyle"></u--text>
					</view>
				</view>
				<view class="order-line">
					<u-line></u-line>
				</view>
				<view class="order-oper">
					<u--text :text="item.createTime" :size="12" color="#ccc"></u--text>
					<view class="btn-wrap">
						<u-button v-if="item.status == 0" type="primary" shape="circle" text="去支付" size="mini" @click.native.stop="handlePay(item)"></u-button>
						<u-button v-else-if="[1].includes(item.status)" type="primary" shape="circle" text="停止充电" size="mini" @click.native.stop="handleStopCharge(item)"></u-button>
						<u-button v-else-if="[2, 3].includes(item.status)" type="info" shape="circle" text="删除订单" size="mini" plain @click.native.stop="handleDelete(item.id)"></u-button>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" />
		</view>
	</view>
</template>

<script>
	import {
		listRecord,
		delRecord
	} from '@/apis/modules/order.js';
	import chargeMixin from './charge.js';
	export default {
		mixins: [chargeMixin],
		data() {
			return {
				userId: '',
				status: 'loadmore',
				iconStyle: {
					fontSize: '10px',
					color: '#007aff'
				},
				list: [],
				total: 0,
				currentTab: 0,
				loading: true,
				total: 0,
				pager: {
					pageSize: 30,
					pageNum: 1,
				},
				queryParams: {
					status: '',
				},
				tabsList: [
					{value: '', label: '全部'},
					{value: 0, label: '待支付'},
					{value: 1, label: '进行中'},
					{value: 2, label: '已完成'},
					{value: 3, label: '已取消'},
				]
			}
		},
		filters: {
			status(val) {
				// 0.待支付 1.进行中 2.已完成 3.已取消"
				return ['待支付', '进行中', '已完成','已取消'][val]
			}
		},
		onLoad() {
			let profile = uni.getStorageSync('profile') || null;
			this.userId = profile?.userId || '';
			this.fetchList();
		},
		onReachBottom() {
			this.loadMore()
		},
		methods: {
			loadMore() {
				if (this.list.length >= this.total) return;
				this.status = 'loading';
				this.pager.pageNum = ++this.pager.pageNum;
				this.fetchList()
			},
			fetchList() {
				uni.showLoading({})
				listRecord({userId: this.userId, ...this.pager, ...this.queryParams})
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
			
			listenTabChange(option) {
				if (option.value == this.queryParams.status) return
				this.queryParams.status = option.value;
				this.list = [];
				this.pager.pageNum = 1;
				this.status = 'loadmore';
				this.fetchList()
				
				// this.currentTab = idx;
			},
			handleDetail(id) {
				console.log(id)
				uni.$u.route({
					url: 'pages/common/order/detail',
					params: {
						id
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.btn-wrap,
.btn-wrap1{
	width: 120rpx;
	margin-left: 24rpx;
}
.order {
	&-price {
		margin-top: 10rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	&-status{
		color: #666;
		font-size: 22rpx;
	}
	&-oper {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	&-line {
		margin: 16rpx auto;
	}
	&-no {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	&__outter {
		margin: 30rpx 20rpx;
		border-radius: 6px;
		background-color: #fff;
		padding: 30rpx 20rpx;
	}
}

</style>
