<template>
	<view class="order-wrap">
		<u-sticky bgColor="#fff" customStyle="border-bottom:1px solid #eee;">
			<u-tabs :list="tabsList" :scrollable="true" lineWidth="60" lineHeight="2" :duration="100"
				@click="handleTabsClick">
			</u-tabs>
		</u-sticky>

		<view class="order-item" v-for="(item, index) in datas" :key="index">
			<view style="margin-bottom:5px;">
				<u--text color="#666" :text="`${item.identify}: ${item.funValue}`"></u--text>
			</view>
			<u-row>
				<u-col :span="4">
					<view style="width:60px;">
						<u-tag text="服务下发" type="primary" size="mini" :plain="true" v-if="item.funType === 1"
							customStyle="width:80px;"></u-tag>
						<u-tag text="属性获取" type="success" size="mini" :plain="true" v-if="item.funType === 2"
							customStyle="width:80px;"></u-tag>
						<u-tag text="OTA升级" type="warning" size="mini" :plain="true" v-if="item.funType === 3"
							customStyle="width:80px;"></u-tag>
					</view>
				</u-col>
				<u-col :span="8">
					<u--text type="info" prefixIcon="calendar" :text="item.createTime" iconStyle="margin-right:5px">
					</u--text>
				</u-col>
			</u-row>
		</view>

		<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png" :show="total === 0"
			marginTop="30"></u-empty>
		<u-loadmore :status="loadmoreStatus" v-if="total > 0" marginTop="20" />
		<u-loading-page :loading="loading" bg-color="#eef3f7" loadingText="FastBee.cn"></u-loading-page>
	</view>
</template>

<script>
	import { getOrderLogList } from '@/apis/modules/log.js';

	export default {
		data () {
			return {
				tabsList: [{
						id: '0',
						name: '全部'
					},
					{
						id: '1',
						name: '服务下发'
					},
					{
						id: '2',
						name: '属性获取'
					},
					{
						id: '3',
						name: 'OTA升级'
					}
				],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					serialNumber: '',
					deviceId: 0,
					funType: null
				},
				loading: true,
				datas: [], // log列表数据
				total: 0, // 总条数
				loadmoreStatus: 'loadmore',
			};
		},
		onLoad: function (option) {
			this.queryParams.serialNumber = String(option.serialNumber);
			this.queryParams.deviceId = Number(option.deviceId);
			this.getDatas();
		},
		methods: {
			// 获取列表数据
			getDatas () {
				this.loading = true;
				getOrderLogList(this.queryParams).then(res => {
					if (this.queryParams.pageNum == 1) {
						this.datas = res.rows;
					} else {
						this.datas = this.datas.concat(res.rows);
					}
					this.total = res.total;
					this.loading = false;
					uni.stopPullDownRefresh();
				});
			},
			// 单击查询
			handleTabsClick (e) {
				if (e.id == '0') {
					this.queryParams.funType = null;
				} else {
					this.queryParams.funType = e.id;
				}
				this.datas = [];
				this.queryParams.pageNum = 1;
				this.getDatas();
			},
			// 上拉加载
			onReachBottom () {
				this.loadmoreStatus = 'loading';
				this.queryParams.pageNum = this.queryParams.pageNum + 1;
				if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize > this.total) {
					this.loadmoreStatus = 'nomore';
				} else {
					this.getDatas();
					this.loadmoreStatus = 'loadmore';
				}
			},
			// 下拉刷新
			onPullDownRefresh () {
				this.datas = [];
				this.queryParams.pageNum = 1;
				this.getDatas();
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #eef3f7;
	}

	.order-wrap {
		.order-item {
			box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			margin: 10px;
			padding: 10px;
			background-color: #ffffff;
		}
	}
</style>