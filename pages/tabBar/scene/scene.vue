<template>
	<page-meta>
		<navigation-bar title="场景联动" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="container">
		<u-sticky bgColor="#fff" customStyle="border-bottom:1px solid #eee;">
			<u-tabs :list="group" :scrollable="true" lineWidth="40" lineHeight="2" :duration="100" @change="statusChange">
				<view slot="right" style="padding: 8px;" @tap="newAddScene()">
					<u-icon name="plus" size="20" bold></u-icon>
				</view>
			</u-tabs>
		</u-sticky>

		<view class="wrapper">
			<view class="item" v-for="(item, index) in list" :key="index">
				<view class="card" @click="gotoScene(item.sceneId)">
					<view class="title">
						<u--text lines="1" margin="0 0 0 10px" color="#fff" :text="item.sceneName"></u--text>
						<u-icon name="arrow-right" color="#fff" customStyle="margin-right:5px;" size="12"></u-icon>
					</view>

					<u-row customStyle="margin:10px 0">
						<u-col span="7">
							<u--text lines="1" prefixIcon="checkbox-mark" iconStyle="margin-right:3px;" size="12" text="条件"></u--text>
						</u-col>
						<u-col span="5">
							<u--text lines="1" :text="item.condition" size="12"></u--text>
						</u-col>
					</u-row>

					<u-row customStyle="margin:10px 0">
						<u-col span="7">
							<u--text lines="1" prefixIcon="play-right" iconStyle="margin-right:3px;" size="12" text="执行一次" lineHeight="16"></u--text>
						</u-col>
						<u-col span="5" justify="cneter">
							<view @tap.stop>
								<u-button text="执行" size="mini" :plain="true" customStyle="width:40px;margin-left:0;min-width:20px;border:1px solid #3fd1ad;color:#3fd1ad"
								 @click="handleRun(item)"></u-button>
							</view>
						</u-col>
					</u-row>

					<u-row customStyle="margin:10px 0">
						<u-col span="7">
							<u--text lines="1" prefixIcon="checkmark-circle" iconStyle="margin-right:3px;" size="12" text="场景状态" lineHeight="16"></u--text>
						</u-col>
						<u-col span="5" justify="cneter">
							<view @tap.stop>
								<u-switch v-model="item.status" @change="switchStatus()" :inactiveValue="0" :activeValue="1" activeColor="#3fd1ad"
								 inactiveColor="#c4c6c9" customStyle="border-radius:3px;" size="18"></u-switch>
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
		</view>

		<u-empty mode="list" :show="total == 0" marginTop="30"></u-empty>
		<u-loadmore :status="status" v-if="total>queryParams.pageSize" marginTop="20" />
		<u-loading-page :loading="loading" bg-color="#eef3f7" loadingText="FastBee.cn"></u-loading-page>
	</view>
</template>

<script>
	import {
		listScene
	} from '@/apis/modules/scene';
	export default {
		data() {
			return {
				// 刷新和加载相关
				status: 'nomore',
				// 遮罩层
				loading: true,
				list: [],
				total: 1,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					status: null
				},

				switchValue: '1',
				group: [{
						id: null,
						name: '全部'
					},
					{
						id: 1,
						name: '启用'
					},
					{
						id: 2,
						name: '未启用'
					}
				],
				list: []
			};
		},
		onLoad() {
			this.getList();
		},
		onReady() {},
		methods: {
			newAddScene() {
				uni.navigateTo({
					url: '/pagesA/list/scene/sceneEdit'
				});
			},
			gotoScene(id) {
				uni.navigateTo({
					url: '/pagesA/list/scene/sceneEdit?sceneId=' + id
				});
			},
			switchRun() {},
			switchStatus() {},
			// 获取场景列表
			getList() {
				console.log(this.queryParams, '参数')
				listScene(this.queryParams)
					.then(response => {
						this.list = this.list.concat(response.rows)
						this.total = response.total
						console.log(response, '场景联动列表')
					})
					.catch(e => {
						console.log(e);
					});
				this.loading = false;
			},
			// 场景状态改变事件
			statusChange(item) {
				this.list = [];
				this.queryParams.status = item.id;
				this.queryParams.pageNum = 1;
				this.getList();
			},
			// 下拉刷新
			onPullDownRefresh() {
				console.log('下拉刷新');
				this.list = [];
				this.queryParams.pageNum = 1;
				// 模拟网络请求
				setTimeout(x => {
					this.getList();
					uni.stopPullDownRefresh();
				}, 1000);
			},
			// 上拉加载
			onReachBottom() {
				console.log('上拉加载');
				this.status = 'loading';
				this.queryParams.pageNum = ++this.queryParams.pageNum;
				// 模拟网络请求
				setTimeout(() => {
					if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize >= this.total) {
						this.status = 'nomore';
					} else {
						this.status = 'loading';
						this.getList();
					}
				}, 1000);
			},
			//执行一次
			handleRun(scene) {
				let actions = JSON.parse(scene.actions);
				console.log(actions, '执行');
				for (let i = 0; i < actions.length; i++) {
					let topic = "";
					let message = ""
					if (actions[i].type == 1) {
						// 属性,在线模式
						topic = "/" + actions[i].productId + "/" + actions[i].serialNumber + "/property-online/get";
						message = '[{"id":"' + actions[i].id + '","value":"' + actions[i].value + '"}]';
					} else if (actions[i].type == 2) {
						// 功能,在线模式
						topic = "/" + actions[i].productId + "/" + actions[i].serialNumber + "/function-online/get";
						message = '[{"id":"' + actions[i].id + '","value":"' + actions[i].value + '"}]';
					}
					if (topic != "") {
						// 发布
						this.$mqttTool.publish(topic, message, actions[i].deviceName)
					}
				}
			},
			// 重新请求列表数据
			resetList() {
				this.queryParams = {
					pageNum: 1,
					pageSize: 10,
					status: null
				};
				this.list = [];
				this.getList();
			}
		}
	};
</script>

<style>
	page {
		background: #eef3f7;
	}

	.container {
		padding-bottom: 100px;
	}

	.wrapper {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.wrapper .item {
		width: 50%;
	}

	.wrapper .item .card {
		box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		margin: 10px;
		padding: 10px;
		background-color: #ffffff;
	}

	.wrapper .item .title {
		background-color: #3fd1ad;
		padding: 3px 0;
		margin: 0 -10px;
		margin-top: -10px;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
		display: flex;
	}
</style>
