<template>
	<page-meta><navigation-bar title="分类动态" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view style="margin-top: 20px">
			<view><u--text prefixIcon="grid-fill" iconStyle="font-size: 16px;color:#606266" :text="categoryName" bold color="#606266"></u--text></view>
		</view>
		<view v-for="(item, index) in list" :key="index">
			<u-line margin="10px 0 15px 0"></u-line>
			<view style="display: flex; align-items: center">
				<view style="margin-right: 10px">
					<u--image :src="item.imgUrl" @click="gotoDetail(item.newsId)" mode="aspectFill" radius="5" width="120" height="80">
						<template v-slot:loading>
						   <u-loading-icon></u-loading-icon>
						 </template>
					</u--image>
				</view>
				<view>
					<u--text lines="2" lineHeight="24" size="16" @click="gotoDetail(item.newsId)" :text="item.title"></u--text>
					<view style="display: flex; align-items: center; margin-top: 5px">
						<view style="margin-right: 10px">
							<u--text
								prefixIcon="account"
								iconStyle="color:#606266;font-size:14px;margin-right:3px;"
								size="12"
								color="#606266"
								mode="name"
								:text="item.author"
							></u--text>
						</view>
						<view>
							<u--text
								prefixIcon="calendar"
								iconStyle="color:#606266;font-size:14px;margin-right:3px;"
								size="12"
								color="#606266"
								mode="date"
								:text="item.createTime"
							></u--text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-empty mode="list" :show="total == 0" marginTop="30"></u-empty>
		<u-loadmore :status="status" v-if="total>queryParams.pageSize" marginTop="20" />
	</view>
</template>

<script>
import { listTrend } from '@/apis/modules/trend';
import projectConfig from '@/env.config.js';
export default {
	data() {
		return {
			// 刷新和加载相关
			status: 'nomore',
			list: [],
			total: 0,
			queryParams: {
				pageNum: 1,
				pageSize: 10,
				status:1,
				categoryId: null,
			},
			categoryName: ''
		};
	},
	//option为object类型，会序列化上个页面传递的参数
	onLoad: function(option) {
		this.queryParams.categoryId = option.categoryId;
		this.categoryName = option.categoryName;
	},
	created() {
		this.getlistTrend();
	},
	methods: {
		gotoDetail(newsId) {
			uni.navigateTo({
				url: '/pagesA/list/trend/trendDetail?newsId=' + newsId
			});
		},
		//列表
		getlistTrend() {
			listTrend(this.queryParams).then(res => {
				this.queryParams.pageNum++;
				let list = null;
				let rows = res.rows
					.map((item, i) => {
						item.imgUrl = projectConfig.baseUrl + item.imgUrl;
						return item;
					})
					// .filter(item => item.categoryId == this.queryParams.categoryId);
				if (this.queryParams.pageNum == 1) {
					this.list = rows;
				} else {
					this.list = this.list.concat(rows);
				}
				this.total = res.total;
				this.loading = false;
				uni.stopPullDownRefresh();
			});
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.list = [];
			this.queryParams.pageNum = 1;
			// Http获取列表
			this.getlistTrend();
		},
		// 上拉加载
		onReachBottom() {
			this.status = 'loading';
			this.queryParams.pageNum = this.queryParams.pageNum + 1;
			if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize > this.total) {
				this.status = 'nomore';
			} else {
				this.getlistTrend();
				this.status = 'loading';
			}
		}
	}
};
</script>

<style>
.container {
	padding: 10px;
	padding-bottom: 100px;
}
</style>
