<template>
	<page-meta><navigation-bar title="最新动态" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<u-swiper v-if="listSwiper.length" :list="listSwiper" indicator indicatorMode="line" @click="gotoSwiperDetail"
			circular></u-swiper>
		<view v-for="(item, index) in list" :key="index">
			<view
				style="margin-top:30px;display:flex;flex-direction:row; justify-content:space-between;align-items: flex-end;">
				<view><u--text prefixIcon="grid-fill" iconStyle="font-size: 16px;color:#606266"
						:text="item.categoryName" bold color="#606266"></u--text></view>
				<view @click="gotoCategoryTrend(item.categoryId, item.categoryName)"><u--text text="查看更多 > "
						color="#606266" customStyle="font-size:12px;"></u--text></view>
			</view>
			<u-line margin="5px 0 15px 0"></u-line>
			<view v-for="(subItem, i) in item.newsList" :key="i"
				style="display:flex;align-items: center;margin-bottom:15px;">
				<view style="margin-right:10px;">
					<u--image :src="subItem.imgUrl" @click="gotoDetail(subItem.newsId)" mode="aspectFill" radius="5"
						width="120" height="80">
						<template v-slot:loading>
							<u-loading-icon></u-loading-icon>
						</template>
					</u--image>
				</view>
				<view>
					<u--text lines="2" lineHeight="24" size="16" @click="gotoDetail(subItem.newsId)"
						:text="subItem.title"></u--text>
					<view style="display:flex;margin-top:6px;">
						<view style="margin-right:20px;">
							<u--text prefixIcon="account" iconStyle="color:#606266;font-size:14px;margin-right:3px;"
								size="12" color="#606266" mode="name" :text="subItem.author"></u--text>
						</view>
						<view>
							<u--text prefixIcon="calendar" iconStyle="color:#606266;font-size:14px;margin-right:3px;"
								size="12" color="#606266" mode="date" :text="subItem.createTime"></u--text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"
			:show="listSwiper.length === 0 && list.length === 0" marginTop="30"></u-empty>
		<u-loading-page :loading="loading" bg-color="#eef3f7" loadingText="FastBee.cn"></u-loading-page>
	</view>
</template>

<script>
	import {
		bannerListTrend,
		listTrend,
		topListTrend
	} from '@/apis/modules/trend';
	import projectConfig from '@/env.config.js';
	export default {
		data () {
			return {
				loading: true,
				// 置顶新闻列表
				list: [],
				// Banner图列表
				listSwiper: [],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					totalCount: 10
				}
			};
		},
		onShow () {
			this.getbannerListTrend();
			this.getlistTrend();
		},
		methods: {
			gotoSwiperDetail (e) {
				this.gotoDetail(this.listSwiper[e].newsId);
			},
			gotoDetail (newsId) {
				uni.navigateTo({
					url: '/pagesA/list/trend/trendDetail?newsId=' + newsId
				});
			},
			gotoCategoryTrend (categoryId, categoryName) {
				uni.navigateTo({
					url: '/pagesA/list/trend/categoryTrend?categoryId=' + categoryId + '&categoryName=' +
						categoryName
				});
			},
			getbannerListTrend () {
				bannerListTrend()
					.then(response => {
						this.listSwiper = response.data.map(item => {
							return projectConfig.baseUrl + item.imgUrl;
						});
					})
					.catch(e => {
						console.log(e);
					});
			},
			getlistTrend () {
				topListTrend().then(response => {
					let trends = response.data;
					this.list = trends.map((item, i) => {
						item.newsList.map((subItem, index) => {
							subItem.imgUrl = projectConfig.baseUrl + subItem.imgUrl;
							return subItem;
						});
						return item;
					});
					this.loading = false;
				});
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