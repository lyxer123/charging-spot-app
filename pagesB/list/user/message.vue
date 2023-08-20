<template>
	<page-meta><navigation-bar title="消息" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view v-for="(item, index) in list" :key="index" class="card" @tap="gotoDetail(item.noticeId)">
				<view style="margin-bottom:10px;">
					<u--text lines="2" lineHeight="24" size="16" :text="item.noticeTitle" ></u--text>
				</view>
				<u-row>
					<u-col :span="4">
						<u--text
							prefixIcon="calendar"
							iconStyle="color:#606266;font-size:14px;margin-right:3px;"
							size="12"
							color="#606266"
							mode="name"
							:text="item.createBy"
						></u--text>
					</u-col>
					<u-col :span="4">
						<u--text
							prefixIcon="account"
							iconStyle="color:#606266;font-size:14px;margin-right:3px;"
							size="12"
							color="#606266"
							mode="date"
							:text="item.createTime"
						></u--text>
					</u-col>
					<u-col :span="4">
						<view style="width:38px;">
							<u-tag text="通知" type="warning" size="mini" :plain="true" v-if="item.noticeType == 1"></u-tag>
							<u-tag text="公告" type="success" size="mini" :plain="true" v-if="item.noticeType == 2"></u-tag>
						</view>
					</u-col>
				</u-row>
				<view style="display:flex;margin-top:6px;justify-content:flex-start;">
					<view style="margin-right:50px;"></view>
					<view></view>
				</view>
		</view>

		<u-loadmore :status="status" marginTop="20" />
	</view>
</template>

<script>
import { listNotice } from '@/apis/modules/notice';

export default {
	data() {
		return {
			// 刷新和加载相关
			status: 'nomore',
			list: [],
			totalCount: 0,
			queryParams: {
				pageNum: 0,
				pageSize: 10
			}
		};
	},
	onShow() {
		this.queryParams.pageNum = 1;
		this.getlistNotice();
	},
	methods: {
		gotoDetail(noticeId) {
			uni.navigateTo({
				url: '/pages/tabBar/user/messageDetail?noticeId=' + noticeId
			});
		},
		getlistNotice() {
			listNotice(this.queryParams).then(res => {
				if (this.queryParams.pageNum == 1) {
					this.list = res.rows;
				} else {
					this.list = this.list.concat(res.rows);
				}
				this.totalCount = res.total;
				this.loading = false;
				uni.stopPullDownRefresh();
			});
		},

		// 下拉刷新
		onPullDownRefresh() {
			this.list = [];
			this.queryParams.pageNum = 1;
			// 模拟网络请求
			this.getlistNotice();
		},
		// 上拉加载
		onReachBottom() {
			this.status = 'loading';
			this.queryParams.pageNum = this.queryParams.pageNum + 1;
			if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize > this.totalCount) {
				this.status = 'nomore';
			} else {
				this.getlistNotice();
				this.status = 'loading';
			}
		}
	}
};
</script>

<style>
page {
	background: #eef3f7;
}
.container {
}
.card {
	box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	margin: 10px;
	padding: 20px;
	background-color: #ffffff;
}
</style>
