<template>
	<view class="trigger_box">
		<u--form labelWidth="100" labelAlign="center" :model="triggerForm">
			<view class="trigger_item" v-for="(item,index) in triggerForm.triggerList" :key='index'>
				<view class="item_content">
					<u-form-item label="选择设备" borderBottom @click="showDeviceSelect(index)">
						<u--input v-model="item.deviceName" disabled disabledColor="#ffffff" placeholder="请选择设备"
							border="none"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="触发类型" borderBottom @click="showTypeSelect(index)" v-if="item.deviceId">
						<u--input v-model="item.typeName" disabled disabledColor="#ffffff" placeholder="请选择触发类型"
							border="none"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="类型名称" borderBottom @click="showTriggerMethodSelect(index)"
						v-if="item.type===1||item.type===2">
						<u--input v-model="item.name" disabled disabledColor="#ffffff" placeholder="请选择类型名称"
							border="none">
						</u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<view v-if="item.thingsModelItem && Object.keys(item.thingsModelItem).length !== 0">
						<u-form-item label="匹配值" borderBottom
							v-if="item.thingsModelItem.datatype.type=='integer' || item.thingsModelItem.datatype.type=='decimal'">
							<u--input v-model="item.value" :max="item.thingsModelItem.datatype.max"
								:min="item.thingsModelItem.datatype.min" type="number" disabledColor="#ffffff"
								placeholder="请填写值" border="none">
							</u--input>
							<text slot="right">{{item.thingsModelItem.datatype.unit}}</text>
						</u-form-item>
						<u-form-item label="匹配值" borderBottom v-else-if="item.thingsModelItem.datatype.type=='bool'">
							<u-switch v-model="item.value" :activeValue="1" :inactiveValue="0"
								customStyle="border-radius:3px;" size="20"></u-switch>
						</u-form-item>
						<u-form-item label="匹配值" borderBottom @click="showFunctionSelect(index)"
							v-else-if="item.thingsModelItem.datatype.type=='enum'">
							<u--input v-model="item.value" disabled disabledColor="#ffffff" placeholder="请选择匹配值"
								border="none"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="匹配值" borderBottom v-else-if="item.thingsModelItem.datatype.type=='string'">
							<u--input v-model="item.value" disabledColor="#ffffff" placeholder="请输入字符串"
								:max="item.thingsModelItem.datatype.maxLength" border="none"></u--input>
						</u-form-item>
						<u-form-item label="匹配值" borderBottom v-else-if="item.thingsModelItem.datatype.type=='array'">
							<u--input v-model="item.value" disabledColor="#ffffff" placeholder="请输入英文逗号分隔的数组"
								border="none">
							</u--input>
						</u-form-item>
					</view>
				</view>
				<view class="item_delet">
					<u-icon v-if="index != 0" name="minus-circle-fill" color="#f05459" size="28"
						@click="removeExecute(index)"></u-icon>
				</view>
			</view>
		</u--form>
		<!-- 设备选择 -->
		<u-popup :show="isDeviceShow" :closeable='true' :round="10" mode='center' @close="isDeviceShow=false">
			<view class="device_list_box">
				<view class="select_title">
					选择设备
				</view>
				<view class="select_search_box">
					<u--form labelWidth="80" labelAlign="center" :model="searchFrom">
						<u-form-item label="设备名称">
							<u--input v-model="searchFrom.deviceName" disabledColor="#ffffff" placeholder="请输入设备名称">
							</u--input>
							<u-button type="primary" slot="right" text="搜索" size="small"
								customStyle="width:70px;margin:0 0 0 10px;" @click="searchDevice"></u-button>
						</u-form-item>
					</u--form>

					<view class="device_list">
						<view class="list_header">
							<view style="width: 10%;"></view>
							<view class="item_header">
								设备名称
							</view>
							<view class="item_header">
								设备编号
							</view>
							<view class="item_header item_state">
								状态
							</view>
						</view>
						<view class="list_box">
							<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
								@scrolltolower="lower" @scroll="scroll">
								<u-radio-group placement="column" v-model="deviceRadiovalue"
									@change="groupChange($event)">
									<view class="device_item" v-for="(item, index) in deviceRadiolist" :key="index">
										<view class="item_radio">
											<u-radio :name="item.deviceId"></u-radio>
										</view>
										<text class="item_name">{{item.deviceName}}</text>
										<text class="item_number">{{item.serialNumber}}</text>
										<text class="item_state">
											<text class="state_radius"
												:class="{'online': item.status === 3,'offline': item.status === 4, 'inactive': item.status === 1}"></text>
										</text>
									</view>
								</u-radio-group>
							</scroll-view>
						</view>
					</view>
				</view>
				<view class="device_btn_list">
					<u-button type="primary" text="确定" size="small" customStyle="width:70px;margin:0 30px 0 0;"
						@click="deviceSelectConfirm"></u-button>
					<u-button text="取消" size="small" customStyle="width:70px;margin:0;" @click="isDeviceShow=false">
					</u-button>
				</view>
			</view>
		</u-popup>
		<!-- 触发类型-->
		<u-picker :show="isTriggerTypeShow" :columns="triggerTypes" keyName="label" :defaultIndex='[0]'
			@confirm='typeSelectConfirm' @cancel='isTriggerTypeShow=false' :closeOnClickOverlay='true'
			@close='isTriggerTypeShow=false'></u-picker>
		<!-- 触发类型名称-->
		<u-picker :show="isTriggerMethodShow" :columns="triggerMethodData" keyName="name" :defaultIndex='[0]'
			@confirm='triggerMethodSelectConfirm' @cancel='isTriggerMethodShow=false' :closeOnClickOverlay='true'
			@close='isTriggerMethodShow=false'></u-picker>
		<!-- 功能下拉-->
		<u-picker :show="isFunctionShow" :columns="functionData" keyName="text" :defaultIndex='[0]'
			@confirm='functionSelectConfirm' @cancel='isFunctionShow=false' :closeOnClickOverlay='true'
			@close='isFunctionShow=false'></u-picker>
	</view>
</template>

<script>
	import {
		deviceShortList,
		modelCache
	} from '@/apis/modules/scene';
	export default {
		data () {
			return {
				isDeviceShow: false, //设备选择弹出框显示开关
				isTriggerTypeShow: false, //触发类型
				isTriggerMethodShow: false, //	触发方法
				isFunctionShow: false, //	功能下拉选择开关
				triggerForm: {
					triggerList: [{
						deviceName: '', //设备名称
						deviceId: '', //设备id
						serialNumber: '', //设备编号
						productId: '', //产品id
						productName: '', //产品名
						typeName: '',
						id: '',
						name: '',
						type: null,
						operatorName: '',
						operator: '',
						value: '',
						thingsModel: {},
						thingsModelItem: {}
					}, ]
				},
				searchFrom: {
					deviceName: '', //设备名称
					serialNumber: '' //设备编号
				}, //设备列表筛选条件表单
				// 触发器类别
				triggerTypes: [
					[{
						value: 1,
						label: '属性'
					}, {
						value: 2,
						label: '功能'
					}]
				],
				presentSourceIndex: 0, //
				scrollTop: 0,
				deviceRadiovalue: null, //	设备索引 用于获取设备id及名称
				deviceRadiolist: [], //设备列表
				triggerMethodData: [], //触发方法列表
				functionData: [], // 功能列表
				pageNum: 1,
				pageSize: 10,
				triggersDetailData: []
			}
		},
		props: {
			actionsDetail: {
				type: Array,
				default: function () {
					return {}
				}
			}
		},
		watch: {
			actionsDetail: function (newVal, oldVal) {
				this.triggersDetailData = newVal
				console.log(this.triggersDetailData, '触发详情1')
				this.getTriggersDetailData()
			}
		},
		methods: {
			//是否是详情
			getTriggersDetailData () {
				this.triggerForm.triggerList = []
				this.triggersDetailData.map((item, index) => {
					let newObj = {
						deviceName: item.deviceName,
						deviceId: item.deviceId,
						serialNumber: item.serialNumber,
						productId: item.productId,
						productName: item.productName,
						typeName: item.type === 1 ? '属性' : item.type === 2 ? '功能' : '',
						type: item.type,
						operatorName: '',
						operator: '',
						value: item.value,
						name: item.name,
						id: item.id,
						thingsModel: {},
						thingsModelItem: undefined,
					}
					this.triggerForm.triggerList.push(newObj);
					this.getDetailModel(index, item);
					console.log(newObj, '循环触发器');
				})
			},
			upper: function (e) {
				console.log(e);
			},
			lower: function (e) {
				this.pageNum++;
				this.deviceShortList();
				console.log(e);
			},
			scroll: function (e) {
				console.log(e);
			},
			//打开设备选择弹出框
			showDeviceSelect (index) {
				this.presentSourceIndex = index;
				this.isDeviceShow = true;
				this.pageNum = 1;
				this.pageSize = 10;
				this.deviceRadiolist = [];
				this.deviceRadiovalue = this.triggerForm.triggerList[index].deviceId;
				this.deviceShortList();
			},
			groupChange (n) {
				console.log('groupChange', n);
			},
			//设备选项改变
			radioChange (n) {
				console.log('radioChange', n);
			},
			//设备选项确定
			deviceSelectConfirm () {
				let deviceInfo = this.deviceRadiolist.find(item => item.deviceId === this.deviceRadiovalue);
				this.triggerForm.triggerList[this.presentSourceIndex].deviceName = deviceInfo.deviceName;
				this.triggerForm.triggerList[this.presentSourceIndex].deviceId = deviceInfo.deviceId;
				this.triggerForm.triggerList[this.presentSourceIndex].serialNumber = deviceInfo.serialNumber;
				this.triggerForm.triggerList[this.presentSourceIndex].productId = deviceInfo.productId;
				this.triggerForm.triggerList[this.presentSourceIndex].productName = deviceInfo.productName;
				this.triggerForm.triggerList[this.presentSourceIndex].id = null;
				this.triggerForm.triggerList[this.presentSourceIndex].thingsModelItem = null;
				this.triggerForm.triggerList[this.presentSourceIndex].value = '';
				this.triggerForm.triggerList[this.presentSourceIndex].name = '';
				this.triggerForm.triggerList[this.presentSourceIndex].operator = '';
				this.triggerForm.triggerList[this.presentSourceIndex].operatorName = '';
				this.isDeviceShow = false;
				this.modelCache(this.triggerForm.triggerList[this.presentSourceIndex].productId);
			},
			// 触发类型选择
			typeSelectConfirm (event) {
				this.triggerForm.triggerList[this.presentSourceIndex].type = event.value[0].value;
				this.triggerForm.triggerList[this.presentSourceIndex].typeName = event.value[0].label;
				this.triggerForm.triggerList[this.presentSourceIndex].id = '';
				this.triggerForm.triggerList[this.presentSourceIndex].name = '';
				this.triggerForm.triggerList[this.presentSourceIndex].value = '';
				this.triggerForm.triggerList[this.presentSourceIndex].thingsModelItem = null;
				this.triggerForm.triggerList[this.presentSourceIndex].operator = '';
				this.triggerForm.triggerList[this.presentSourceIndex].operatorName = '';
				this.isTriggerTypeShow = false;
			},
			//触发类型开关
			showTypeSelect (index) {
				this.presentSourceIndex = index;
				this.isTriggerTypeShow = true;
			},
			/* 触发方法名称选择 */
			showTriggerMethodSelect (index) {
				this.presentSourceIndex = index;
				console.log(this.triggerForm.triggerList[this.presentSourceIndex], '点击了当前数据');
				if (this.triggerForm.triggerList[this.presentSourceIndex].type === 1) {
					console.log('进来了1');
					let propertiesList = this.triggerForm.triggerList[this.presentSourceIndex].thingsModel.properties
						.filter(item => item.isMonitor === 0).filter(item => item.isReadonly === 0);
					if (propertiesList.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '暂无下拉数据'
						});
						this.triggerMethodData = [
							[]
						];
						console.log('进来了2', this.triggerMethodData);
					} else {
						this.triggerMethodData = [propertiesList];
						console.log('进来了3', this.triggerMethodData);
						this.isTriggerMethodShow = true;
					}
				} else if (this.triggerForm.triggerList[this.presentSourceIndex].type === 2) {
					let functions = this.triggerForm.triggerList[this.presentSourceIndex].thingsModel.functions
					let functionList = functions && functions.filter(item => item.isReadonly === 0) || [];
					console.log('进来了4');
					if (functionList.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '暂无下拉数据'
						});
						this.triggerMethodData = [
							[]
						];
						console.log('进来了5', this.triggerMethodData);
					} else {
						this.triggerMethodData = [functionList];
						this.isTriggerMethodShow = true;
						console.log('进来了6', this.triggerMethodData)
					}
				}
			},
			triggerMethodSelectConfirm (event) {
				console.log(event, '触发方法名');
				this.triggerForm.triggerList[this.presentSourceIndex].thingsModelItem = event.value[0];
				this.triggerForm.triggerList[this.presentSourceIndex].id = event.value[0].id;
				this.triggerForm.triggerList[this.presentSourceIndex].name = event.value[0].name;
				this.triggerForm.triggerList[this.presentSourceIndex].value = event.value[0].datatype.type === "bool" ?
					'0' : '';;
				this.isTriggerMethodShow = false;
			},
			// 功能下拉选择打开
			showFunctionSelect (index) {
				this.presentSourceIndex = index;
				let thingsModelItem = this.triggerForm.triggerList[this.presentSourceIndex].thingsModelItem;
				this.functionData = [thingsModelItem.datatype.enumList];
				this.isFunctionShow = true;
			},
			functionSelectConfirm (event) {
				this.triggerForm.triggerList[this.presentSourceIndex].value = event.value[0].text;
				this.isFunctionShow = false;
			},
			//添加执行动作
			addExecute () {
				let newObj = {
					deviceName: '', //设备名称
					deviceId: '', //设备id
					serialNumber: '', //设备编号
					productId: '', //产品id
					productName: '', //产品名
					typeName: '',
					id: '',
					name: '',
					type: null,
					value: '',
					thingsModel: {},
					thingsModelItem: undefined,
				}
				this.triggerForm.triggerList.push(newObj);
			},
			//删除执行动作
			removeExecute (index) {
				this.triggerForm.triggerList.splice(index, 1);
			},
			//搜索设备
			searchDevice () {
				this.pageNum = 1;
				this.pageSize = 10;
				this.deviceRadiolist = [];
				this.deviceShortList();
			},
			//获取设备列表
			deviceShortList () {
				let data = {
					deviceName: this.searchFrom.deviceName,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				};
				deviceShortList(data)
					.then(response => {
						this.deviceRadiolist = this.deviceRadiolist.concat(response.rows);
						console.log(response, '设备列表');
					})
					.catch(e => {
						console.log(e);
					});
			},
			//根据设备id获取下拉选项数据
			modelCache (productId) {
				modelCache(productId)
					.then(response => {
						this.triggerForm.triggerList[this.presentSourceIndex].thingsModel = JSON.parse(response.data);
						console.log(JSON.parse(response.data), '根据设备id获取下拉选项数据');
					})
					.catch(e => {
						console.log(e);
					});
			},
			//详情时获取模型
			getDetailModel (index, item) {
				modelCache(item.productId)
					.then(response => {
						this.triggerForm.triggerList[index].thingsModel = JSON.parse(response.data);
						if (item.type === 1) {
							this.triggerForm.triggerList[index].thingsModelItem = this.triggerForm.triggerList[index]
								.thingsModel.properties.find(k => k.id === item.id);
						} else if (item.type === 2) {
							this.triggerForm.triggerList[index].thingsModelItem = this.triggerForm.triggerList[index]
								.thingsModel.functions.find(k => k.id === item.id);
						}
						console.log(this.triggerForm.triggerList, '122123131');
					})
					.catch(e => {
						console.log(e);
					});
			},
			//获取表单数据 传递父组件
			getFormData () {
				return this.triggerForm;
			}
		}
	}
</script>

<style lang="scss">
	.trigger_box {

		.trigger_item {
			display: flex;
			flex-direction: row;
			align-items: center;
			border-bottom: 2px dashed rgb(214, 215, 217);
			padding: 10px 0;

			&:last-child {
				border-bottom: 0;
			}

			.item_content {
				flex: 1;
				width: 100%;

				/deep/ .u-line:last-child {
					border-bottom: 0 !important;
				}
			}

			.item_delet {
				margin-left: 0.5rem;
				width: 28px;
			}

			.u-checkbox-group--row.data-v-2ef8bac9 {
				flex-wrap: wrap;
			}
		}

		.device_list_box {
			width: 328px;
			padding: 12px;

			.select_title {
				font-size: 16px;
				font-weight: 400;
				line-height: 24px;
				color: #000;
				margin-bottom: 10px;
			}

			.select_search_box {
				width: 100%;
			}

			.device_list {
				.list_header {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin: 10px 0 5px;

					.item_header {
						width: 40%;
						text-align: center;
						font-size: 14px;
						line-height: 16px;
						color: #333333;
						font-size: 400;

						&.item_state {
							width: 10%;
						}
					}
				}

				.list_box {
					.scroll-Y {
						max-height: 650rpx;

						.device_item {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							border-bottom: 1px solid #d6d7d9;
							padding: 10px 0;

							.item_radio {
								width: 10%;
								text-align: center;
							}

							.item_name {
								width: 40%;
								text-align: center;
								font-size: 12px;
								line-height: 16px;
								color: #666;
							}

							.item_number {
								width: 40%;
								text-align: center;
								font-size: 12px;
								line-height: 16px;
								white-space: normal;
								overflow: hidden;
								text-overflow: ellipsis;
								color: #666;
							}

							.item_state {
								width: 10%;

								.state_radius {
									display: block;
									width: 16px;
									height: 16px;
									border-radius: 50%;
									margin: 0 auto;

									&.online {
										background-color: #5ac725;
									}

									&.offline {
										background-color: #797c83;
									}

									&.inactive {
										background-color: #fead09;
									}
								}
							}
						}
					}
				}
			}

			.device_btn_list {
				margin-top: 10px;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}
</style>