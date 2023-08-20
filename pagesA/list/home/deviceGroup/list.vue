<template>
	<page-meta><navigation-bar title="设备分组" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view class="search">
			<u-row>
				<u-col span="8">
					<u-search
						v-model="queryParams.groupName"
						shape="square"
						@search="handleSearch"
						@custom="handleSearch"
						:actionStyle="{ backgroundColor: '#398ade', color: '#fff', padding: '6px', borderRadius: '3px' }"
					></u-search>
				</u-col>
				<u-col span="4"><u-button @click="gotoAddGrup()" type="success" text="新增" icon="plus" customStyle="width:60px;margin-left:10px;" size="small"></u-button></u-col>
			</u-row>
		</view>

		<view class="card" v-for="(item, index) in dataList" :key="index" >
			<u-row gutter="10" customStyle="margin:0;">
				<u-col :span="6" customStyle="background-color:#3fd1ad;padding:15px;border-top-left-radius:5px;border-bottom-left-radius:5px;">
					<u--text prefixIcon="grid" iconStyle="color:#fff;font-size:20px;margin-right:3px;" bold lines="1" :text="item.groupName" customStyle="color:#fff;"></u--text>
				</u-col>
				<u-col :span="6">
					<view style="display:flex;">
						<u-button type="success" @click="gotoDeviceList(item)" size="small" customStyle="width:80px;">添加设备</u-button>
						<u-button type="primary" @click="gotoEdit(item)" size="small" customStyle="width:60px;">详情</u-button>
					</view>
				</u-col>
			</u-row>
		</view>

		<u-empty mode="list" :show="total == 0" marginTop="30"></u-empty>
		<u-loading-page :loading="loading" loadingText="FastBee.cn"></u-loading-page>
		<u-loadmore :status="status" v-if="total > queryParams.pageSize" marginTop="20" />
	</view>
</template>

<script>
import { listGroup } from '@/apis/modules/group';

export default {
	data() {
		return {
			// 遮罩层
			loading: true,
			// 加载更多
			status: 'nomore',
			// 列表数据
			dataList: [],
			// 总条数
			total: 0,
			queryParams: {
				pageNum: 1,
				pageSize: 10,
				userId:0,
				groupName: null,
			}
		};
	},
	onLoad() {
		this.queryParams.userId=this.profile.userId;
		this.getList();
	},
	onShow(){
		let operate=getApp().globalData.operate;
		if(operate && operate=='operate'){
			this.getList();
			// 置空 operate
			getApp().globalData.operate="";
		}
		
	},
	methods: {
		// 获取列表数据
		getList() {
			listGroup(this.queryParams).then(response => {
				if (this.queryParams.pageNum == 1) {
					this.dataList = response.rows;
				} else {
					this.dataList = this.dataList.concat(response.rows);
				}
				this.total = response.total;
				this.loading = false;
				uni.stopPullDownRefresh();
			});
		},
		// 编辑
		gotoEdit(item) {
			uni.navigateTo({
				url: '/pagesA/list/home/deviceGroup/form?groupId=' + item.groupId
			});
		},
		// 选择分组设备
		gotoDeviceList(item){
			uni.navigateTo({
				url: '/pagesA/list/home/deviceGroup/deviceList?groupId=' + item.groupId +'&groupUserId='+item.userId
			});
		},
		// 新增
		gotoAddGrup() {
			uni.navigateTo({
				url: '/pagesA/list/home/deviceGroup/form'
			});
		},
		// 搜索
		handleSearch(value) {
			this.dataList = [];
			this.queryParams.pageNum = 1;
			this.getList(true);
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.dataList = [];
			this.queryParams.pageNum = 1;
			// Http获取列表
			this.getList();
		},
		// 上拉加载
		onReachBottom() {
			this.status = 'loading';
			this.queryParams.pageNum = this.queryParams.pageNum + 1;
			if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize > this.total) {
				this.status = 'nomore';
			} else {
				this.getList();
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
.search {
	padding: 10px;
	background: #ffffff;
}
.card {
	box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	margin: 20px 10px;
	background-color: #ffffff;
}
</style>
