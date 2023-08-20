<template>
	<page-meta><navigation-bar title="选择设备" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view class="search">
			<u-row>
				<u-col span="8">
					<u-search
						v-model="queryParams.deviceName"
						shape="square"
						@search="handleSearch"
						@custom="handleSearch"
						:actionStyle="{ backgroundColor: '#398ade', color: '#fff', padding: '6px', borderRadius: '3px' }"
					></u-search>
				</u-col>
				<u-col span="4"><u-button @click="handleDeviceSelected()" type="success" text="保存" customStyle="width:60px;margin-left:10px;" size="small"></u-button></u-col>
			</u-row>
		</view>

		<view class="group">
			<u--text lines="2" lineHeight="24" bold size="16" text="选择设备"></u--text>
			<u-line customStyle="margin:5px 0 10px 0;"></u-line>
			<u-checkbox-group v-model="checkBoxValue" placement="column" iconPlacement="right" :borderBottom="false">
				<u-checkbox
					:customStyle="{ margin: '20px 10px' }"
					v-for="(item, index) in dataList"
					:key="index"
					:label="item.deviceName + ' (' + item.serialNumber + ')'"
					:name="item.deviceId"
					@change="checkboxChange($event, item)"
				></u-checkbox>
			</u-checkbox-group>
		</view>

		<u-empty mode="list" :show="total == 0" marginTop="30"></u-empty>
		<u-loading-page :loading="loading" loadingText="FastBee.cn"></u-loading-page>
		<u-loadmore :status="status" v-if="total > queryParams.pageSize" marginTop="20" />
	</view>
</template>

<script>
import { getDeviceIds, updateDeviceGroups } from '@/apis/modules/group';
import { listDeviceByGroup } from '@/apis/modules/device';

export default {
	data() {
		return {
			// 遮罩层
			loading: true,
			// 加载更多
			status: 'nomore',
			// 列表数据
			dataList: [],
			// 复选框值
			checkBoxValue: [],
			checkBoxValueOld: [],
			// 总条数
			total: 0,
			// 分组ID
			groupId: 0,
			queryParams: {
				pageNum: 1,
				pageSize: 20,
				userId:0,
				deviceName: null,
			}
		};
	},
	onLoad(option) {
		this.groupId = option.groupId;
		this.queryParams.userId = option.groupUserId;
		this.getDeviceIdsByGroupId();
	},
	methods: {
		// 复选框改变事件
		checkboxChange(value, item) {
			let index = this.checkBoxValueOld.indexOf(item.deviceId);
			if (index == -1 && value) {
				// 不存在且选中
				this.checkBoxValueOld.push(item.deviceId);
			} else if (index != -1 && !value) {
				// 存在且取消选中
				this.checkBoxValueOld.splice(index, 1);
			}
		},
		// 更新分组下的设备
		handleDeviceSelected() {
			// 分组设备更新参数
			let deviceGroup = {
				groupId: this.groupId,
				deviceIds: this.checkBoxValueOld
			};
			updateDeviceGroups(deviceGroup).then(response => {
				uni.showToast({ icon: 'success', title: '更新分组下的设备成功' });
				// 返回
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 1000);
			});
		},
		// 获取分组下关联的设备ID数组
		getDeviceIdsByGroupId() {
			getDeviceIds(this.groupId).then(response => {
				this.checkBoxValue = response.data;
				this.checkBoxValueOld = response.data;
				this.getList();
			});
		},
		// 获取列表数据
		getList() {
			listDeviceByGroup(this.queryParams).then(response => {
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
		// 搜索
		handleSearch(value) {
			this.dataList = [];
			this.queryParams.pageNum = 1;
			this.getList();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.dataList = [];
			this.queryParams.pageNum = 1;
			// Http获取列表
			this.getDeviceIdsByGroupId();
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
.group {
	background-color: #fff;
	padding: 10px;
	margin-top: 10px;
}
</style>
