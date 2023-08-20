<template>
	<view class="event-wrap">
		<u-sticky bgColor="#fff" customStyle="border-bottom:1px solid #eee;">
			<u-tabs :list="tabsList" :scrollable="true" lineWidth="60" lineHeight="2" :duration="100"
				@click="handleTabsClick">
			</u-tabs>
		</u-sticky>

		<view class="log-item" v-for="(item, index) in datas" :key="index">
			<view style="margin-bottom:5px;">
				<u--text color="#666" :text="formatValueDisplay(item)"></u--text>
			</view>
			<u-row>
				<u-col :span="4">
					<view style="width:60px;">
						<u-tag text="功能调用" type="primary" size="mini" :plain="true" v-if="item.logType == 2"
							customStyle="width:80px;"></u-tag>
						<u-tag text="属性上报" type="primary" size="mini" :plain="true" v-if="item.logType == 1"
							customStyle="width:80px;"></u-tag>
						<u-tag text="事件上报" type="error" size="mini" :plain="true" v-if="item.logType == 3"
							customStyle="width:80px;"></u-tag>
						<u-tag text="设备上线" type="success" size="mini" :plain="true" v-if="item.logType == 5"
							customStyle="width:80px;"></u-tag>
						<u-tag text="设备离线" type="info" size="mini" :plain="true" v-if="item.logType == 6"
							customStyle="width:80px;"></u-tag>
						<u-tag text="设备升级" type="warning" size="mini" :plain="true" v-if="item.logType == 4"
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
	import { getEventLogList } from '@/apis/modules/deviceLog.js';
	import { getCacheThingsModel } from '@/apis/modules/device.js'

	export default {
		data () {
			return {
				tabsList: [{
						id: '0',
						name: '全部'
					},
					{
						id: '1',
						name: '属性上报'
					},
					{
						id: '2',
						name: '功能调用'
					},
					{
						id: '3',
						name: '事件上报'
					},
					{
						id: '4',
						name: '设备升级'
					},
					{
						id: '5',
						name: '设备上线'
					},
					{
						id: '6',
						name: '设备离线'
					}
				],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					serialNumber: '',
					identity: null,
					logType: null
				},
				loading: true,
				thingsModels: {}, // 物模型
				datas: [], // log列表数据
				total: 0, // 总条数
				loadmoreStatus: 'loadmore',
			};
		},
		onLoad: async function (option) {
			this.queryParams.serialNumber = String(option.serialNumber);
			const productId = Number(option.productId);
			this.thingsModels = await this.getThingsModdel(productId);
			this.getDatas();
		},
		methods: {
			// 获取列表数据
			getDatas () {
				this.loading = true;
				getEventLogList(this.queryParams).then(res => {
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
			// 获取缓存物模型
			getThingsModdel (productId) {
				return new Promise((resolve, reject) => {
					getCacheThingsModel(productId).then(res => {
						resolve(JSON.parse(res.data));
					}).catch(err => {
						reject(err);
					})
				})
			},
			// 单击查询
			handleTabsClick (e) {
				if (e.id == '0') {
					this.queryParams.logType = null;
				} else {
					this.queryParams.logType = e.id;
				}
				this.datas = [];
				this.queryParams.pageNum = 1;
				this.getDatas();
			},
			// 格式化显示数据定义
			formatValueDisplay (row) {
				// 类型（1=属性上报，2=调用功能，3=事件上报，4=设备升级，5=设备上线，6=设备离线）
				if (row.logType === 1) {
					let propertyItem = this.getThingsModelItem(1, row.identity);
					if (propertyItem != "") {
						return (propertyItem.parentName ? '[' + propertyItem.parentName + (propertyItem.arrayIndex ?
								propertyItem.arrayIndex : '') + '] ' : '') +
							propertyItem.name +
							'：' + this.getThingsModelItemValue(propertyItem, row.logValue) +
							' ' +
							(propertyItem.datatype.unit != undefined ? propertyItem.datatype.unit : '');
					}
				} else if (row.logType === 2) {
					let functionItem = this.getThingsModelItem(2, row.identity);
					if (functionItem != "") {
						return (functionItem.parentName ? '[' + functionItem.parentName + (functionItem.arrayIndex ?
								functionItem.arrayIndex : '') + '] ' : '') +
							functionItem.name +
							'：' + this.getThingsModelItemValue(functionItem, row.logValue) +
							' ' +
							(functionItem.datatype.unit != undefined ? functionItem.datatype.unit : '');
					}
				} else if (row.logType === 3) {
					let eventItem = this.getThingsModelItem(3, row.identity);
					if (eventItem != "") {
						return (eventItem.parentName ? '[' + eventItem.parentName + (eventItem.arrayIndex ? eventItem
								.arrayIndex : '') + '] ' : '') +
							eventItem.name +
							'：' + this.getThingsModelItemValue(eventItem, row.logValue) +
							' ' +
							(eventItem.datatype.unit != undefined ? eventItem.datatype.unit : '');
					}
				} else if (row.logType === 4) {
					return '设备升级';
				} else if (row.logType === 5) {
					return '设备上线';
				} else if (row.logType === 6) {
					return '设备离线';
				}
				return '';
			},
			// 获取物模型中的项
			getThingsModelItem (type, identity) {
				if (type == 1 && this.thingsModels.properties) {
					for (let i = 0; i < this.thingsModels.properties.length; i++) {
						//普通类型 integer/decimal/string/emum//bool
						if (this.thingsModels.properties[i].id == identity) {
							return this.thingsModels.properties[i];
						}
						// 对象 object
						if (this.thingsModels.properties[i].datatype.type == "object") {
							for (let j = 0; j < this.thingsModels.properties[i].datatype.params.length; j++) {
								if (this.thingsModels.properties[i].datatype.params[j].id == identity) {
									this.thingsModels.properties[i].datatype.params[j].parentName = this.thingsModels
										.properties[i].name;
									return this.thingsModels.properties[i].datatype.params[j];
								}
							}
						}
						// 数组 array
						if (this.thingsModels.properties[i].datatype.type == "array" && this.thingsModels.properties[i]
							.datatype.arrayType) {
							if (this.thingsModels.properties[i].datatype.arrayType == "object") {
								// 数组元素格式：array_01_parentId_humidity,array_01_前缀终端上报时加上，物模型中没有
								let realIdentity = identity;
								let arrayIndex = 0;
								if (identity.indexOf("array_") > -1) {
									arrayIndex = identity.substring(6, 8);
									realIdentity = identity.substring(9);
								}
								for (let j = 0; j < this.thingsModels.properties[i].datatype.params.length; j++) {
									if (this.thingsModels.properties[i].datatype.params[j].id == realIdentity) {
										// 标注索引和父级名称
										this.thingsModels.properties[i].datatype.params[j].arrayIndex = Number(
												arrayIndex) +
											1;
										this.thingsModels.properties[i].datatype.params[j].parentName = this.thingsModels
											.properties[i].name;
										return this.thingsModels.properties[i].datatype.params[j];
									}
								}
							} else {
								// 普通类型
								for (let j = 0; j < this.thingsModels.properties[i].datatype.arrayCount.length; j++) {
									if (this.thingsModels.properties[i].id == realIdentity) {
										this.thingsModels.properties[i].arrayIndex = Number(arrayIndex) + 1;
										this.thingsModels.properties[i].parentName = "元素";
										return this.thingsModels.properties[i];
									}
								}
							}

						}
					}
				} else if (type == 2 && this.thingsModels.functions) {
					for (let i = 0; i < this.thingsModels.functions.length; i++) {
						//普通类型 integer/decimal/string/emum/bool
						if (this.thingsModels.functions[i].id == identity) {
							return this.thingsModels.functions[i];
						}
						// 对象 object
						if (this.thingsModels.functions[i].datatype.type == "object") {
							for (let j = 0; j < this.thingsModels.functions[i].datatype.params.length; j++) {
								if (this.thingsModels.functions[i].datatype.params[j].id == identity) {
									this.thingsModels.functions[i].datatype.params[j].parentName = this.thingsModels
										.functions[i].name;
									return this.thingsModels.functions[i].datatype.params[j];
								}
							}
						}
						// 数组 array
						if (this.thingsModels.functions[i].datatype.type == "array" && this.thingsModels.functions[i]
							.datatype.arrayType) {
							// 数组元素格式：array_01_parentId_humidity,array_01_前缀终端上报时加上，物模型中没有
							let realIdentity = identity;
							let arrayIndex = 0;
							if (identity.indexOf("array_") > -1) {
								arrayIndex = identity.substring(6, 8);
								realIdentity = identity.substring(9);
							}
							if (this.thingsModels.functions[i].datatype.arrayType == "object") {
								for (let j = 0; j < this.thingsModels.functions[i].datatype.params.length; j++) {
									if (this.thingsModels.functions[i].datatype.params[j].id == realIdentity) {
										// 标注索引和父级名称
										this.thingsModels.functions[i].datatype.params[j].arrayIndex = Number(arrayIndex) +
											1;
										this.thingsModels.functions[i].datatype.params[j].parentName = this.thingsModels
											.functions[i].name;
										return this.thingsModels.functions[i].datatype.params[j];
									}
								}
							} else {
								// 普通类型
								for (let j = 0; j < this.thingsModels.functions[i].datatype.arrayCount.length; j++) {
									if (this.thingsModels.functions[i].id == realIdentity) {
										this.thingsModels.functions[i].arrayIndex = Number(arrayIndex) + 1;
										this.thingsModels.functions[i].parentName = "元素";
										return this.thingsModels.functions[i];
									}
								}
							}

						}
					}
				} else if (type == 3 && this.thingsModels.events) {
					for (let i = 0; i < this.thingsModels.events.length; i++) {
						if (this.thingsModels.events[i].id == identity) {
							return this.thingsModels.events[i];
						}
					}
				}
				return "";
			},
			// 获取物模型项中的值
			getThingsModelItemValue (item, oldValue) {
				if (item.datatype.type == 'bool') {
					if (oldValue == '0') {
						return item.datatype.falseText;
					} else if (oldValue == '1') {
						return item.datatype.trueText;
					}
				} else if (item.datatype.type == 'enum') {
					for (let i = 0; i < item.datatype.enumList.length; i++) {
						if (oldValue == item.datatype.enumList[i].value) {
							return item.datatype.enumList[i].text;
						}
					}
				}
				return oldValue;
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

	.event-wrap {
		.log-item {
			box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			margin: 10px;
			padding: 10px;
			background-color: #ffffff;
		}
	}
</style>