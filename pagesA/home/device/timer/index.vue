<template>
	<view class="container">
		<view class="search">
			<u-row>
				<u-col span="8">
					<u-search v-model="queryParams.jobName" shape="square" @search="handleSearch" @custom="handleSearch"
						:actionStyle="{ backgroundColor: '#398ade', color: '#fff', padding: '6px', borderRadius: '3px' }">
					</u-search>
				</u-col>
				<u-col span="4">
					<u-button @click="gotoAddGrup()" type="success" text=" 新增" icon="plus"
						customStyle="width:60px;margin-left:10px;" size="small"></u-button>
				</u-col>
			</u-row>
		</view>
		<view class="card" v-for="(item, index) in dataList" :key="index">
			<view class="title">
				<view style="margin:2px 5px 0 5px;">
					<u-icon name="clock" color="#fff" size="18"></u-icon>
				</view>
				<view style="flex:1">
					<u--text customStyle="color:#fff;" :text="item.jobName" @tap="gotoEdit(item)"></u--text>
				</view>
				<view style="width:60px;">
					<u-button text="未启用" @click="handleStatusChange(item)" type="info" size="mini" plain
						v-if="item.status == '1'" customStyle="width:50px;margin:0;align-self:flex-end;"></u-button>
					<u-button text="启用" @click="handleStatusChange(item)" type="success" size="mini" plain
						v-if="item.status == '0'" customStyle="width:50px;margin:0;align-self:flex-end;"></u-button>
				</view>
			</view>
			<view style="margin:15px 0px 10px 3px;font-size:12px;">
				<view v-html="formatCronDisplay(item)"></view>
			</view>
			<view style="display:flex;">
				<view v-html="formatActionsDisplay(item.actions)"
					style="border-radius:6px;min-height:60px;width:100%;margin-right:15px;padding:5px;font-size:10px;background-color:#f8f8f8;">
				</view>
				<view style="width:75px;">
					<u-button @tap="handleRun(item)" type="error" size="small" :plain="true" text="执行一次"
						customStyle="width:70px;margin:0 0 10px;align-self:flex-end;"></u-button>
					<u-button type="primary" size="small" @tap="gotoEdit(item)" text="查看详情"
						customStyle="width:70px;margin:0;align-self:flex-end;"></u-button>
				</view>
			</view>
		</view>
		<u-modal :show="modalShow" :title="modalTitle" :content="modalContent" @confirm="modalConfirm"
			@cancel="modalCancle" :showCancelButton="true"></u-modal>

		<u-empty mode="list" :show="total == 0" marginTop="30"></u-empty>
		<u-loadmore :status="status" v-if="total > queryParams.pageSize" marginTop="20" loadmoreText="点击加载更多..."
			@loadmore="loadMoreLogs()" />
		<u-loading-page :loading="loading" loadingText="ykhl.vip"></u-loading-page>
	</view>
</template>

<script>
	import { listJob, changeJobStatus, runJob } from '@/apis/modules/deviceJob';

	export default {
		name: 'device-timer',
		props: {
			device: {
				type: Object,
				default: null,
				required: true
			}
		},
		watch: {
			// 兼容小程序
			device: function (newVal, oldVal) {
				this.deviceInfo = newVal;
				this.queryParams.deviceId = newVal.deviceId;
				this.getData();
			},
		},
		data () {
			return {
				switchStatus: '0',
				// 模态窗显示
				modalShow: false,
				modalTitle: '',
				modalContent: '',
				handleType: 1, // 1-修改状态，2-执行一次
				currentTimer: {}, // 当前选中的设备定时项
				loading: true, // 遮罩层
				status: 'loadmore', // 加载更多
				thingsModel: {}, // 物模型
				deviceInfo: {}, // 设备信息
				dataList: [], // 列表数据
				total: 0, // 总条数
				queryParams: {
					pageNum: 1,
					pageSize: 6,
					deviceId: 0
				}
			};
		},
		created () {
			// 获取设备状态(兼容H5和APP)
			if (this.device.deviceId) {
				this.deviceInfo = newVal;
				this.queryParams.deviceId = newVal.deviceId;
				this.getData();
			}
		},
		methods: {
			// 获取数据
			getData () {
				this.thingsModel = this.deviceInfo.cacheThingsModel;
				this.thingsModel.properties = this.thingsModel.properties && this.thingsModel.properties.filter(item =>
					item.isMonitor == 0);
				this.getList();
			},
			// 获取列表数据
			getList () {
				listJob(this.queryParams).then(response => {
					if (this.queryParams.pageNum == 1) {
						this.dataList = response.rows;
					} else {
						this.dataList = this.dataList.concat(response.rows);
					}
					console.log('dataList', this.dataList);
					this.total = response.total;
					this.loading = false;
					uni.stopPullDownRefresh();
				});
			},
			// 模态窗确定
			modalConfirm () {
				if (this.handleType == 1) {
					// 修改定时状态
					this.currentTimer.status = this.currentTimer.status === '0' ? '1' : '0';
					changeJobStatus(this.currentTimer.jobId, this.currentTimer.status)
						.then(() => {
							uni.showToast({
								icon: 'uni.showToast',
								title: '修改成功'
							});
						})
						.catch(function () {
							// this.currentTimer.status = this.currentTimer.status === '0' ? '1' : '0';
							uni.showToast({
								icon: 'none',
								title: '修改失败'
							});
						});
				} else if (this.handleType == 2) {
					// 执行一次
					runJob(this.currentTimer.jobId, this.currentTimer.jobGroup)
						.then(() => {
							console.log('执行成功');
							uni.showToast({
								icon: 'success',
								title: '执行成功'
							});
						})
						.catch(function () {
							console.log('执行失败');
							uni.showToast({
								icon: 'none',
								title: '执行失败'
							});
						});
				}
				this.modalShow = false;
			},
			// 模态窗取消
			modalCancle () {
				if (this.handleType == 1) {
					// this.currentTimer.status = this.currentTimer.status === '0' ? '1' : '0';
				}
				this.modalShow = false;
			},
			// 定时状态修改
			handleStatusChange (row) {
				let text = row.status === '1' ? '启用' : '停用';
				this.modalContent = '确认要"' + text + '""' + row.jobName + '"定时吗？';
				this.modalShow = true;
				this.handleType = 1;
				this.currentTimer = row;
			},
			// 立即执行一次
			handleRun (row) {
				this.modalContent = '确认要立即执行一次"' + row.jobName + '"定时吗？';
				this.modalShow = true;
				this.handleType = 2;
				this.currentTimer = row;
			},
			// 编辑
			gotoEdit (item) {
				uni.navigateTo({
					url: `/pagesB/home/device/timer/edit?jobId=${item.jobId}&deviceId=${this.queryParams.deviceId}&productId=${this.deviceInfo.productId}&serialNumber=${this.deviceInfo.serialNumber}`
				});
			},
			// 新增
			gotoAddGrup () {
				uni.navigateTo({
					url: `/pagesB/home/device/timer/edit?deviceId=${this.queryParams.deviceId}&productId=${this.deviceInfo.productId}&serialNumber=${this.deviceInfo.serialNumber}`
				});
			},
			// 搜索
			handleSearch (value) {
				this.dataList = [];
				this.queryParams.pageNum = 1;
				this.getList(true);
			},
			// 下拉刷新
			deviceTimerRefresh () {
				this.dataList = [];
				this.queryParams.pageNum = 1;
				// Http获取列表
				this.getList();
				this.status = 'loadmore';
			},
			// 上拉加载
			loadMoreLogs () {
				this.status = 'loading';
				this.queryParams.pageNum = this.queryParams.pageNum + 1;
				if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize > this.total) {
					this.status = 'nomore';
				} else {
					this.getList();
					this.status = 'loadmore';
				}
			},
			/** 格式化显示动作 */
			formatActionsDisplay (json) {
				if (json == null || json == '') {
					return;
				}
				let actions = JSON.parse(json);
				let result = '';
				for (let i = 0; i < actions.length; i++) {
					let value = actions[i].value;
					if (actions[i].type == 1) {
						// 属性
						for (let j = 0; j < this.thingsModel.properties.length; j++) {
							if (actions[i].id == this.thingsModel.properties[j].id) {
								if (this.thingsModel.properties[j].datatype == 'decimal' || this.thingsModel.properties[j]
									.datatype == 'integer') {
									value = actions[i].value + this.thingsModel.properties[j].datatype.unit;
								} else if (this.thingsModel.properties[j].datatype == 'enum') {
									for (let k = 0; k < this.thingsModel.properties[j].datatype.enumList.length; k++) {
										if (actions[i].value == this.thingsModel.properties[j].datatype.enumList[k]
											.value) {
											value = this.thingsModel.properties[j].datatype.enumList[k].text;
											break;
										}
									}
								} else if (this.thingsModel.properties[j].datatype == 'bool') {
									value = actions[i].value == '1' ? this.thingsModel.properties[j].datatype.trueText :
										this.thingsModel.properties[j].datatype.falseText;
								}
								break;
							}
						}
					} else if (actions[i].type == 2) {
						// 功能
						for (let j = 0; j < this.thingsModel.functions.length; j++) {
							if (actions[i].id == this.thingsModel.functions[j].id) {
								if (this.thingsModel.functions[j].datatype.type == 'decimal' || this.thingsModel.functions[
										j].datatype.type == 'integer') {
									value = actions[i].value + this.thingsModel.functions[j].datatype.unit;
								} else if (this.thingsModel.functions[j].datatype.type == 'enum') {
									for (let k = 0; k < this.thingsModel.functions[j].datatype.enumList.length; k++) {
										if (actions[i].value == this.thingsModel.functions[j].datatype.enumList[k].value) {
											value = this.thingsModel.functions[j].datatype.enumList[k].text;
											break;
										}
									}
								} else if (this.thingsModel.functions[j].datatype.type == 'bool') {
									value = actions[i].value == '1' ? this.thingsModel.functions[j].datatype.trueText :
										this.thingsModel.functions[j].datatype.falseText;
								}
								break;
							}
						}
					}
					result = result + '• ' + actions[i].name + '：<span style="color:#3fd1ad;line-height:24px;">' + value +
						'</span><br />';
				}
				return result;
			},
			/** 格式化显示CRON描述 */
			formatCronDisplay (item) {
				let result = '';
				if (item.isAdvance == 0) {
					let time = '<span>' + item.cronExpression.substring(5, 7) + ':' + item.cronExpression.substring(2, 4) +
						'</span>';
					let week = item.cronExpression.substring(12);
					if (week == '1,2,3,4,5,6,7') {
						result = '每天 ' + time;
					} else {
						let weekArray = week.split(',');
						for (let i = 0; i < weekArray.length; i++) {
							if (weekArray[i] == '1') {
								result = result + '周一、';
							} else if (weekArray[i] == '2') {
								result = result + '周二、';
							} else if (weekArray[i] == '3') {
								result = result + '周三、';
							} else if (weekArray[i] == '4') {
								result = result + '周四、';
							} else if (weekArray[i] == '5') {
								result = result + '周五、';
							} else if (weekArray[i] == '6') {
								result = result + '周六、';
							} else if (weekArray[i] == '7') {
								result = result + '周日、';
							}
						}
						result = result.substring(0, result.length - 1) + " <span style='color:#3fd1ad'>( " + time +
							' )</span>';
					}
				} else {
					result = '自定义Cron表达式';
				}
				return result;
			}
		}
	};
</script>

<style>
	page {
		background: #eef3f7;
	}

	.container {}

	.search {
		padding: 10px;
		background: #ffffff;
	}

	.card {
		box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		margin: 10px;
		margin-bottom: 20px;
		padding: 10px;
		padding-bottom: 20px;
		background-color: #ffffff;
	}

	.card .title {
		background-color: #3fd1ad;
		margin: -10px;
		padding: 6px 5px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		margin-bottom: 10px;
		display: flex;
	}
</style>