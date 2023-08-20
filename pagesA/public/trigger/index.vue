<template>
	<view class="trigger_box">
		<u--form labelWidth="100" labelAlign="center" :model="triggerForm">
			<view class="trigger_item" v-for="(item,index) in triggerForm.triggerList" :key='index'>
				<view class="item_content">
					<u-form-item label="触发方式" borderBottom @click="showSourceSelect(index)">
						<u--input v-model="item.sourceName" disabled disabledColor="#ffffff" placeholder="请选择触发方式"
							border="none"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<view v-if='item.source === 1'>
						<u-form-item label="选择设备" borderBottom @click="showDeviceSelect(index)">
							<u--input v-model="item.deviceName" disabled disabledColor="#ffffff" placeholder="请选择设备"
								border="none"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<view>
							<u-form-item label="触发类型" borderBottom @click="showTypeSelect(index)" v-if="item.deviceId">
								<u--input v-model="item.typeName" disabled disabledColor="#ffffff" placeholder="请选择触发类型"
									border="none"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="类型名称" borderBottom @click="showTriggerMethodSelect(index)"
								v-if="item.type===1||item.type===2||item.type===3">
								<u--input v-model="item.name" disabled disabledColor="#ffffff" placeholder="请选择类型名称"
									border="none"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="操作符" borderBottom @click="showOperatorSelect(index)"
								v-if="item.type===1||item.type===2||item.type===3">
								<u--input v-model="item.operatorName" disabled disabledColor="#ffffff"
									placeholder="请选择操作符" border="none"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<view
								v-if="(item.type===1||item.type===2||item.type===3) && item.thingsModelItem && Object.keys(item.thingsModelItem).length !== 0">
								<u-form-item label="匹配值" borderBottom
									v-if="item.thingsModelItem &&(item.thingsModelItem.datatype.type=='integer' || item.thingsModelItem.datatype.type=='decimal')">
									<u--input v-model="item.value" :max="item.thingsModelItem.datatype.max"
										:min="item.thingsModelItem.datatype.min" type="number" disabledColor="#ffffff"
										placeholder="请填写值" border="none">
									</u--input>
									<text slot="right">{{item.thingsModelItem.datatype.unit}}</text>
								</u-form-item>
								<u-form-item label="匹配值" borderBottom
									v-else-if="item.thingsModelItem &&item.thingsModelItem.datatype.type=='bool'">
									<u-switch v-model="item.value" :activeValue='"1"' :inactiveValue='"0"'
										customStyle="border-radius:3px;" size="20"></u-switch>
								</u-form-item>
								<u-form-item label="匹配值" borderBottom @click="showFunctionSelect(index)"
									v-else-if="item.thingsModelItem &&item.thingsModelItem.datatype.type=='enum'">
									<u--input v-model="item.value" disabled disabledColor="#ffffff" placeholder="请选择匹配值"
										border="none"></u--input>
									<u-icon slot="right" name="arrow-right"></u-icon>
								</u-form-item>
								<u-form-item label="匹配值" borderBottom
									v-else-if="item.thingsModelItem &&item.thingsModelItem.datatype.type=='string'">
									<u--input v-model="item.value" disabledColor="#ffffff" placeholder="请输入字符串"
										:max="item.thingsModelItem.datatype.maxLength" border="none"></u--input>
								</u-form-item>
								<u-form-item label="匹配值" borderBottom
									v-else-if="item.thingsModelItem &&item.thingsModelItem.datatype.type=='array'">
									<u--input v-model="item.value" disabledColor="#ffffff" placeholder="请输入英文逗号分隔的数组"
										border="none"></u--input>
								</u-form-item>
							</view>
						</view>
					</view>
					<view v-else>
						<u-form-item label="选择时间" borderBottom @click="showTimerTimeSelect(index)">
							<u--input v-model="item.timerTimeValue" disabled disabledColor="#ffffff" placeholder="请选择时间"
								border="none"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item class="timerWeekWrap" label="选择星期" borderBottom>
							<u-checkbox-group v-model="item.timerWeekValue" placement="row"
								@change="timerWeekChange($event,item)">
								<u-checkbox :customStyle="{marginBottom: '8px',marginRight:'8px'}"
									v-for="(timerWeekItem, timerWeekIndex) in timerWeekList" :key="timerWeekIndex"
									:label="timerWeekItem.label" :name="timerWeekItem.value">
								</u-checkbox>
							</u-checkbox-group>
						</u-form-item>
					</view>
				</view>
				<view class="item_delet">
					<u-icon v-if="index != 0" name="minus-circle-fill" color="#f05459" size="28"
						@click="removeTrigger(index)"></u-icon>
				</view>
			</view>
		</u--form>
		<!-- 触发方式选择 -->
		<u-picker :show="isSourceShow" :columns="sourceColumns" keyName="label" :defaultIndex='[0]'
			@confirm='sourceSelectConfirm' @cancel='isSourceShow=false' :closeOnClickOverlay='true'
			@close='isSourceShow=false'>
		</u-picker>
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
		<!-- 选择时间 -->
		<u-datetime-picker :show="showTimerTime" v-model="timerTimeValue" mode="time" @cancel="showTimerTime=false"
			@close="showTimerTime=false" @confirm="timerTimeConfirm"></u-datetime-picker>
		<!-- 触发类型名称-->
		<u-picker :show="isTriggerMethodShow" :columns="triggerMethodData" keyName="name" :defaultIndex='[0]'
			@confirm='triggerMethodSelectConfirm' @cancel='isTriggerMethodShow=false' :closeOnClickOverlay='true'
			@close='isTriggerMethodShow=false'></u-picker>
		<!-- 操作符-->
		<u-picker :show="operatorShow" :columns="operatorData" keyName="name" :defaultIndex='[0]'
			@confirm='operatorSelect' @cancel='operatorShow=false' :closeOnClickOverlay='true'
			@close='operatorShow=false'></u-picker>
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
		data() {
			return {
				isSourceShow: false, //触发方式下拉筛选开关
				isDeviceShow: false, //设备选择弹出框显示开关
				isTriggerTypeShow: false, //触发类型
				showTimerTime: false, //	时间选择开关
				isTriggerMethodShow: false, //	触发方法
				operatorShow: false, //操作符开关
				isFunctionShow: false, //	功能下拉选择开关
				triggerForm: {
					triggerList: [{
						cronExpression: '',
						source: 1, //	触发方式 1设备触发 2定时触发
						sourceName: '设备触发',
						deviceName: '', //设备名称
						deviceId: '', //设备id
						serialNumber: '', //	设备编号
						productId: '', //产品id
						productName: '', //产品名
						timerTimeValue: '',
						timerWeekValue: [],
						typeName: '',
						id: '',
						name: '',
						type: null,
						operatorName: '',
						operator: '',
						value: '',
						thingsModel: {
							// properties: [{
							// 		id: 1,
							// 		name: '开关',
							// 		datatype: {
							// 			type: "bool",
							// 			falseText: '关闭',
							// 			trueText: '开启'
							// 		}
							// 	},
							// 	{
							// 		id: 2,
							// 		name: '字符串',
							// 		datatype: {
							// 			type: 'string',
							// 			maxLength: '1024'
							// 		}
							// 	}, {
							// 		id: 3,
							// 		name: '数组',
							// 		datatype: {
							// 			type: 'array',
							// 			arrayType: 'int'
							// 		}
							// 	}
							// ],
							// functions: [{
							// 	id: 1,
							// 	name: '功能1',
							// 	datatype: {
							// 		type: "enum",
							// 		enum: [{
							// 				value: "1",
							// 				text: "正常"
							// 			},
							// 			{
							// 				value: "-1",
							// 				text: "警告"
							// 			},
							// 			{
							// 				value: "0",
							// 				text: "未知"
							// 			}
							// 		]
							// 	}
							// }],
							// events: [{
							// 	id: 1,
							// 	name: '计步器',
							// 	datatype: {
							// 		type: "decimal",
							// 		min: "-20",
							// 		max: "55",
							// 		unit: "°C",
							// 		step: "0.01"
							// 	}
							// }]
						},
						thingsModelItem: {}
					}, ]
				},
				searchFrom: {
					deviceName: '', //设备名称
					serialNumber: '' //设备编号
				}, //设备列表筛选条件表单
				sourceColumns: [
					[{
							label: '设备触发',
							value: 1
						},
						{
							label: '定时触发',
							value: 2
						}
					]

				],
				// 选择星期数据
				timerWeekList: [{
					value: 1,
					label: '周一'
				}, {
					value: 2,
					label: '周二'
				}, {
					value: 3,
					label: '周三'
				}, {
					value: 4,
					label: '周四'
				}, {
					value: 5,
					label: '周五'
				}, {
					value: 6,
					label: '周六'
				}, {
					value: 7,
					label: '周日'
				}],
				// 触发器类别
				triggerTypes: [
					[{
							value: 1,
							label: '属性'
						}, {
							value: 2,
							label: '功能'
						}, {
							value: 3,
							label: '事件'
						},
						// {
						//     value: 4,
						//     label: '设备升级'
						// },
						{
							value: 5,
							label: '设备上线'
						}, {
							value: 6,
							label: '设备下线'
						}
					]
				],
				presentSourceIndex: 0, //
				scrollTop: 0,
				deviceRadiovalue: null, //	设备索引 用于获取设备id及名称
				deviceRadiolist: [], //设备列表
				timerTimeValue: '',
				triggerMethodData: [], //触发方法列表
				operatorData: [
					[{
							name: '等于（=）',
							value: '='
						},
						{
							name: '不等于（!=）',
							value: '!='
						},
						{
							name: '大于（>）',
							value: '>'
						},
						{
							name: '小于（<）',
							value: '<'
						},
						{
							name: '大于等于（>=）',
							value: '>='
						},
						{
							name: '小于等于（<=）',
							value: '<='
						},
						{
							name: '包含（contain）',
							value: 'contain'
						}, {
							name: '不包含（not contain）',
							value: 'notcontain'
						}
					]
				], // 操作符列表
				functionData: [], // 功能列表
				pageNum: 1,
				pageSize: 10,
				triggersDetailData: [],
			}
		},
		props: {
			triggersDetail: {
				type: Array,
				default: function() {
					return {}
				}
			}
		},
		watch: {
			triggersDetail: function(newVal, oldVal) {
				this.triggersDetailData = newVal
				console.log(this.triggersDetailData, '触发详情1')
				this.getTriggersDetailData()
			}
		},
		methods: {
			//是否是详情
			getTriggersDetailData() {
				console.log(this.triggersDetailData, '触发详情1.1')
				this.triggerForm.triggerList = []
				this.triggersDetailData.map((item, index) => {
					let newObj = {
						cronExpression: item.cronExpression,
						source: item.source,
						sourceName: item.source === 1 ? '设备触发' : '定时触发',
						deviceName: item.deviceName,
						deviceId: item.deviceId,
						serialNumber: item.serialNumber,
						productId: item.productId,
						productName: item.productName,
						timerTimeValue: '',
						timerWeekValue: [],
						typeName: item.type === 1 ? '属性' : item.type === 2 ? '功能' : item.type === 3 ? '事件' :
							item.type === 5 ? '设备上线' : item.type === 6 ? '设备下线' : '',
						type: item.type,
						operatorName: item.operator === '=' ? '等于（=）' : item.operator === '!=' ? '不等于（!=）' :
							item.operator === '>' ?
							'大于（>）' : item.operator === '<' ? '小于（<）' : item.operator === '>=' ? '大于等于（>=）' :
							item.operator === '<=' ?
							'小于等于（<=）' : item.operator === 'contain' ? '包含（contain）' : '不包含（not contain）',
						operator: item.operator,
						value: item.value,
						name: item.name,
						id: item.id,
						thingsModel: {},
						thingsModelItem: {}
					}
					if (newObj.source === 2) {
						let arrayValue = newObj.cronExpression.substring(12).split(",").map(Number);
						newObj.timerWeekValue = arrayValue;
						let timerTimeValue = newObj.cronExpression.substring(5, 7) + ":" + newObj.cronExpression
							.substring(2, 4);
						newObj.timerTimeValue = timerTimeValue
					}
					this.triggerForm.triggerList.push(newObj);
					newObj.productId && this.getDetailModel(index, item);
					console.log(newObj, '循环触发器');
				})
			},
			upper: function(e) {
				console.log(e)
			},
			lower: function(e) {
				this.pageNum++;
				this.deviceShortList();
				console.log(e);
			},
			scroll: function(e) {
				console.log(e);
			},
			//打开触发方式选择
			showSourceSelect(index) {
				this.presentSourceIndex = index;
				this.isSourceShow = true;
			},
			//触发方式选择
			sourceSelectConfirm(event) {
				this.triggerForm.triggerList[this.presentSourceIndex].source = event.value[0].value;
				this.triggerForm.triggerList[this.presentSourceIndex].sourceName = event.value[0].label;
				if (event.value[0].value == 2) {
					this.triggerForm.triggerList[this.presentSourceIndex].cronExpression = '',
						this.triggerForm.triggerList[this.presentSourceIndex].deviceName = '';
					this.triggerForm.triggerList[this.presentSourceIndex].deviceId = '';
					this.triggerForm.triggerList[this.presentSourceIndex].serialNumber = '';
					this.triggerForm.triggerList[this.presentSourceIndex].productId = '';
					this.triggerForm.triggerList[this.presentSourceIndex].productName = '';
					this.triggerForm.triggerList[this.presentSourceIndex].timerTimeValue = '';
					this.triggerForm.triggerList[this.presentSourceIndex].timerWeekValue = [];
					this.triggerForm.triggerList[this.presentSourceIndex].typeName = '';
					this.triggerForm.triggerList[this.presentSourceIndex].id = '';
					this.triggerForm.triggerList[this.presentSourceIndex].name = '';
					this.triggerForm.triggerList[this.presentSourceIndex].type = '';
					this.triggerForm.triggerList[this.presentSourceIndex].operatorName = '';
					this.triggerForm.triggerList[this.presentSourceIndex].operator = '';
					this.triggerForm.triggerList[this.presentSourceIndex].value = '';
				}
				this.isSourceShow = false;
			},
			//打开设备选择弹出框
			showDeviceSelect(index) {
				this.presentSourceIndex = index;
				this.isDeviceShow = true;
				this.pageNum = 1;
				this.pageSize = 10;
				this.searchFrom.deviceName = '';
				this.deviceRadiolist = [];
				this.deviceRadiovalue = this.triggerForm.triggerList[index].deviceId;
				this.deviceShortList();
			},
			groupChange(n) {
				console.log('groupChange', n);
			},
			//设备选项改变
			radioChange(n) {
				console.log('radioChange', n);
			},
			//设备选项确定
			deviceSelectConfirm() {
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
			typeSelectConfirm(event) {
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
			//打开时间选择
			showTimerTimeSelect(index) {
				this.presentSourceIndex = index;
				this.showTimerTime = true;
			},
			//时间选择确定
			timerTimeConfirm(e) {
				this.timerTimeValue = e.value;
				this.showTimerTime = false;
				this.triggerForm.triggerList[this.presentSourceIndex].timerTimeValue = e.value;
			},
			//星期勾选
			timerWeekChange(event, item) {
				console.log(event);
				item.timerWeekValue = event;
			},
			//触发类型开关
			showTypeSelect(index) {
				this.presentSourceIndex = index;
				this.isTriggerTypeShow = true;
			},
			/* 触发类型名称选择 */
			showTriggerMethodSelect(index) {
				this.presentSourceIndex = index;
				console.log(this.triggerForm.triggerList[this.presentSourceIndex], '当前数据');
				if (this.triggerForm.triggerList[this.presentSourceIndex].type === 1) {
					console.log('进来了1');
					if (this.triggerForm.triggerList[this.presentSourceIndex].thingsModel.properties.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '暂无下拉数据'
						});
						this.triggerMethodData = [
							[]
						];
						console.log('进来了2', this.triggerMethodData);
					} else {
						this.triggerMethodData = [this.triggerForm.triggerList[this.presentSourceIndex].thingsModel
							.properties
						];
						this.isTriggerMethodShow = true;
						console.log('进来了3', this.triggerMethodData);
					}
				} else if (this.triggerForm.triggerList[this.presentSourceIndex].type === 2) {
					if (this.triggerForm.triggerList[this.presentSourceIndex].thingsModel.functions.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '暂无下拉数据'
						});
						this.triggerMethodData = [
							[]
						];
					} else {
						this.triggerMethodData = [this.triggerForm.triggerList[this.presentSourceIndex].thingsModel
							.functions
						];
						this.isTriggerMethodShow = true;
					}
				} else if (this.triggerForm.triggerList[this.presentSourceIndex].type === 3) {
					if (this.triggerForm.triggerList[this.presentSourceIndex].thingsModel.events.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '暂无下拉数据'
						});
						this.triggerMethodData = [
							[]
						];
					} else {
						this.triggerMethodData = [this.triggerForm.triggerList[this.presentSourceIndex].thingsModel
						.events];
						this.isTriggerMethodShow = true;
					}
				}
				console.log(this.triggerMethodData, '当前点击数据的下拉数据');
			},
			triggerMethodSelectConfirm(event) {
				console.log(event, '触发类型名称');
				this.triggerForm.triggerList[this.presentSourceIndex].thingsModelItem = event.value[0];
				this.triggerForm.triggerList[this.presentSourceIndex].id = event.value[0].id;
				this.triggerForm.triggerList[this.presentSourceIndex].name = event.value[0].name;
				this.triggerForm.triggerList[this.presentSourceIndex].value = event.value[0].datatype.type === "bool" ?
					'0' : '';
				this.isTriggerMethodShow = false;
			},
			/* 操作符选择 */
			showOperatorSelect(index) {
				this.presentSourceIndex = index;
				this.operatorShow = true;
			},
			operatorSelect(event) {
				this.triggerForm.triggerList[this.presentSourceIndex].operator = event.value[0].value;
				this.triggerForm.triggerList[this.presentSourceIndex].operatorName = event.value[0].name;
				this.operatorShow = false;
			},
			// 功能下拉选择打开
			showFunctionSelect(index) {
				this.presentSourceIndex = index;
				let thingsModelItem = this.triggerForm.triggerList[this.presentSourceIndex].thingsModelItem;
				this.functionData = [thingsModelItem.datatype.enumList];
				this.isFunctionShow = true;
			},
			functionSelectConfirm(event) {
				this.triggerForm.triggerList[this.presentSourceIndex].value = event.value[0].text;
				this.isFunctionShow = false;
			},
			//添加触发器
			addTragger() {
				let newObj = {
					cronExpression: '',
					source: 1, //	触发方式 1设备触发 2定时触发
					sourceName: '设备触发',
					deviceName: '', //设备名称
					deviceId: '', //设备id
					serialNumber: '', //	设备编号
					timerTimeValue: '',
					timerWeekValue: [],
					typeName: '',
					id: '',
					name: '',
					type: null,
					productId: '', //产品id	
					productName: '', //产品名
					operatorName: '',
					operator: '',
					value: '',
					thingsModel: {},
					thingsModelItem: {}
				};
				this.triggerForm.triggerList.push(newObj);
			},
			//删除触发器
			removeTrigger(index) {
				this.triggerForm.triggerList.splice(index, 1)
			},
			//搜索设备
			searchDevice() {
				this.pageNum = 1;
				this.pageSize = 10;
				this.deviceRadiolist = [];
				this.deviceShortList();
			},
			//获取设备列表
			deviceShortList() {
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
			modelCache(productId) {
				modelCache(productId)
					.then(response => {
						this.triggerForm.triggerList[this.presentSourceIndex].thingsModel = JSON.parse(response.data)
						console.log(JSON.parse(response.data), '根据设备id获取下拉选项数据')
					})
					.catch(e => {
						console.log(e);
					});
			},
			//详情时获取模型
			getDetailModel(index, item) {
				modelCache(item.productId)
					.then(response => {
						this.triggerForm.triggerList[index].thingsModel = JSON.parse(response.data);
						if (item.type === 1) {
							this.triggerForm.triggerList[index].thingsModelItem = this.triggerForm.triggerList[index]
								.thingsModel.properties.find(k => k.id === item.id);
						} else if (item.type === 2) {
							this.triggerForm.triggerList[index].thingsModelItem = this.triggerForm.triggerList[index]
								.thingsModel.functions.find(k => k.id === item.id);
						} else if (item.type === 3) {
							this.triggerForm.triggerList[index].thingsModelItem = this.triggerForm.triggerList[index]
								.thingsModel.events.find(k => k.id === item.id);
						}
						console.log(this.triggerForm.triggerList, '122123131');
					})
					.catch(e => {
						console.log(e);
					});

			},
			//获取表单数据 传递父组件
			getFormData() {
				return this.triggerForm;
			}
		}
	}
</script>

<style scoped lang="scss">
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

		::v-deep .timerWeekWrap {
			.u-form-item__body {
				.u-form-item__body__right {
					overflow-x: auto;
				}
			}
		}
	}
</style>
