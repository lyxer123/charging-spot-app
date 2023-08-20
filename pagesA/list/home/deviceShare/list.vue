<template>
	<page-meta><navigation-bar title="设备分享" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view class="search">
			<u-search
				v-model="phoneNumber"
				shape="square"
				placeholder="请输入用户手机号码"
				actionText="查 询"
				@search="serchUserList"
				@custom="serchUserList"
				:actionStyle="{ backgroundColor: '#398ade', color: '#fff', padding: '6px', borderRadius: '3px' }"
			></u-search>

			<view style="padding:20px 0;" v-if="msg != ''"><u--text :text="msg" type="info" prefixIcon="info-circle" iconStyle="margin-right:5px;"></u--text></view>
			<view v-for="(item, index) in searchUserList" :key="index" class="list-item">
				<u-row gutter="10" customStyle="margin-bottom:10px;">
					<u-col span="6"><u--text type="primary" lines="1" :text="item.userName" prefixIcon="account" size="18" iconStyle="margin-right:5px;"></u--text></u-col>
					<u-col span="6"><u--text type="info" lines="1" :text="'备注：' + (item.nickName == null ? '' : item.nickName)"></u--text></u-col>
				</u-row>
				<u-row gutter="10">
					<u-col span="6"><u--text type="info" :text="item.phonenumber" prefixIcon="phone" iconStyle="margin-right:5px;"></u--text></u-col>
					<u-col span="6">
						<u--text type="info" :text="$u.timeFormat(item.createTime, 'yyyy年mm月dd日')" prefixIcon="calendar" iconStyle="margin-right:5px;"></u--text>
					</u-col>
				</u-row>
				<u-button text="确认分享" @click="addDeviceUser(item)" type="success" size="small" customStyle="margin-top:15px;"></u-button>
			</view>
		</view>

		<view class="list" v-if="dataList.length > 0">
			<u--text prefixIcon="share-fill" iconStyle="size:16px;margin-right:5px;" bold size="16" color="#666" text="已分享用户"></u--text>
			<view v-for="(item, index) in dataList" :key="index" @click="gotoEdit(item)" class="list-item">
				<u-row gutter="10" customStyle="margin-bottom:10px;">
					<u-col span="6"><u--text type="primary" lines="1" :text="item.userName" prefixIcon="account" size="18" iconStyle="margin-right:5px;"></u--text></u-col>
					<u-col span="6"><u--text type="info" lines="1" :text="'备注：' + (item.remark == null ? '' : item.remark)"></u--text></u-col>
				</u-row>
				<u-row gutter="10">
					<u-col span="6"><u--text type="info" :text="item.phonenumber" prefixIcon="phone" iconStyle="margin-right:5px;"></u--text></u-col>
					<u-col span="6">
						<u--text type="info" :text="$u.timeFormat(item.createTime, 'yyyy年mm月dd日')" prefixIcon="calendar" iconStyle="margin-right:5px;"></u--text>
					</u-col>
				</u-row>
			</view>
		</view>

		<u-loading-page :loading="loading" loadingText="FastBee.cn"></u-loading-page>
	</view>
</template>

<script>
import { listDeviceUser, addDeviceUser, getDeviceUser, delDeviceUser, updateDeviceUser } from '@/apis/modules/deviceUser';
import { listUser } from '@/apis/modules/common.js';

export default {
	data() {
		return {
			// 遮罩层
			loading: true,
			// 加载更多
			status: 'nomore',
			// 列表数据
			dataList: [],
			// 查询用户列表
			searchUserList: [],
			// 消息提示
			msg: '',
			// 总条数
			total: 0,
			//设备信息
			deviceId: 0,
			deviceName: '',
			// 手机号码查询
			phoneNumber: null,
			queryParams: {
				pageNum: 1,
				pageSize: 20,
				deviceId: 0
			}
		};
	},
	onLoad(option) {
		this.queryParams.deviceId = option.deviceId;
		this.deviceId = option.deviceId;
		this.deviceName = option.deviceName;
		this.getList();
	},
	methods: {
		// 获取列表数据
		getList() {
			listDeviceUser(this.queryParams).then(response => {
				if (this.queryParams.pageNum == 1) {
					this.dataList = response.rows.filter(x => x.isOwner == 0);
				} else {
					this.dataList = this.dataList.concat(response.rows);
				}
				this.total = response.total;
				this.loading = false;
				uni.stopPullDownRefresh();
			});
		},
		/** 查询用户列表 */
		serchUserList() {
			if (this.phoneNumber && uni.$u.test.mobile(this.phoneNumber)) {
				let params = {
					pageNum: 1,
					pageSize: 5,
					status: 0,
					phonenumber: this.phoneNumber
				};
				listUser(params).then(response => {
					this.searchUserList = response.rows;
					if (this.searchUserList.length == 0) {
						this.msg = '查询不到用户，检查手机号码是否正确';
					} else {
						this.msg = '';
					}
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '请输入正确手机号码'
				});
			}
		},
		// 添加设备用户
		addDeviceUser(user) {
			var form = {};
			form.deviceId = this.deviceId;
			form.deviceName = this.deviceName;
			form.userId = user.userId;
			form.userName = user.userName;
			form.phonenumber = user.phonenumber;
			form.remark = user.nickName;
			addDeviceUser(form).then(response => {
				console.log('addresponse', response);
				if (response.code == 200) {
					// 清空查询用户
					this.msg = '';
					this.searchUserList = [];
					// 重新查询设备用户列表
					this.dataList = [];
					this.queryParams.pageNum = 1;
					this.getList();
				} else {
					this.msg = response.msg;
				}
			});
		},
		// 编辑
		gotoEdit(item) {
			uni.$u.route({
				url: '/pagesA/list/home/deviceShare/form',
				params: {
					userName: item.userName,
					phonenumber:item.phonenumber,
					createTime:item.createTime,
					remark:item.remark,
					userId:item.userId,
					deviceId:item.deviceId,
				}
			});
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
	padding: 30px;
	background: #ffffff;
}
.list {
	box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
	margin-top: 20px;
	padding: 20px 10px;
	background-color: #ffffff;
}
.list-item {
	border: 1px solid #ddd;
	border-radius: 10px;
	margin-top: 15px;
	padding: 15px 10px;
}
</style>
