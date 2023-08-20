<template>
	<page-meta><navigation-bar :title="title" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<view class="card">
			<u--form labelPosition="left" :model="form" :rules="rules" ref="form" labelWidth="90" labelAlign="left">
				<u-form-item label="定时名称" prop="jobName" required><u--input v-model="form.jobName"
						placeholder="请输入定时名称"></u--input></u-form-item>

				<u-form-item label="执行时间" prop="timerTimeValue" required>
					<view @click="dateTimeClick" style="width:100%">
						<u--input prefixIcon="clock" v-model="timerTimeValue" readonly
							:disabled="form.isAdvance == 1"></u--input>
					</view>
				</u-form-item>
				<u-datetime-picker :show="datetimeShow" v-model="timerTimeValue" mode="time" @cancel="dateTimeCancel"
					@confirm="dateTimeConfirm"></u-datetime-picker>
				<u-form-item label="重复执行" prop="timerRepeatValue" required>
					<u-radio-group v-model="timerRepeatValue" placement="row" @change="repeatChange" shape="square"
						:disabled="form.isAdvance == 1">
						<u-radio label="每天 " :name="1" customStyle="margin-right:20px;"></u-radio>
						<u-radio label="指定" :name="2"></u-radio>
					</u-radio-group>
				</u-form-item>
				<view style="margin:10px 0;display:flex;" v-if="timerRepeatValue == 2">
					<view v-for="(item, index) in timerWeeks" :key="index" style="margin-right:6px;">
						<u-tag :text="item.label" size="mini" :plain="!item.checked" type="info" :name="item.value"
							@click="weekChange"></u-tag>
					</view>
				</view>
				<u-form-item label="定时状态" prop="status" required>
					<u-switch v-model="form.status" :inactiveValue="1" :activeValue="0" activeColor="#5ac725"
						inactiveColor="#c4c6c9" customStyle="border-radius:3px;" size="20"></u-switch>
				</u-form-item>
			</u--form>
		</view>

		<view class="card">
			<u--form labelPosition="left" :model="form" :rules="rules" ref="form" labelWidth="90" labelAlign="left">
				<u-form-item label="执行动作" prop="actions" required customStyle="margin-bottom:10px;">
					<u-button type="primary" icon="plus" text="添加" size="mini" @tap="addEnumItem"
						customStyle="width:50px;margin:0;"></u-button>
				</u-form-item>
				<view v-for="(actionItem, index) in actionList" :key="index" class="action">
					<u-row customStyle="margin-bottom:15px;">
						<u-col :span="10">
							<view style="display:flex;">
								<u-button text="功能" :plain="actionItem.type == 1" color="#3fd1ad" size="mini"
									@click="thingsModelTypeChange(actionItem, 2)"
									customStyle="border-top-right-radius:0;border-bottom-right-radius:0;;width:55px;margin:0;"></u-button>
								<u-button text="属性" :plain="actionItem.type == 2" color="#3fd1ad" size="mini"
									@click="thingsModelTypeChange(actionItem, 1)"
									customStyle="border-top-left-radius:0;border-bottom-left-radius:0;width:55px;margin:0;"></u-button>
							</view>
						</u-col>
						<u-col :span="2">
							<u-button v-if="index != 0" type="error" :plain="false" @click="removeEnumItem(index)"
								text="删除" size="mini" align="right"
								customStyle="width:50px;margin:0;align-self:flex-end;"></u-button>
						</u-col>
					</u-row>

					<view style="display:flex;">
						<!-- 选择物模型项 -->
						<view style="flex:1;margin-right:15px;">
							<uni-data-select :value="actionItem.id"
								:localdata="actionItem.actionType == 1 ? thingsModel.properties : thingsModel.functions"
								:clear="false" @change="thingsModelChange($event, actionItem)"></uni-data-select>
						</view>
						<!-- 设置物模型值 -->
						<view style="flex:1.5;">
							<view v-if="
									actionItem.thingsModelItem && (actionItem.thingsModelItem.datatype.type == 'integer' || actionItem.thingsModelItem.datatype.type == 'decimal')
								">
								<u-input v-model="actionItem.value" placeholder="输入整数或小数"
									:maxlength="actionItem.thingsModelItem.datatype.max" type="number"
									customStyle="padding:4px 10px;">
									<u--text :text="actionItem.thingsModelItem.datatype.unit" type="info"
										slot="suffix"></u--text>
								</u-input>
							</view>
							<view
								v-else-if="actionItem.thingsModelItem && actionItem.thingsModelItem.datatype.type == 'bool'">
								<u-switch v-model="actionItem.value" :inactiveValue="0" :activeValue="1"
									customStyle="border-radius:3px;margin-top:3px;" size="26"></u-switch>
							</view>
							<view
								v-else-if="actionItem.thingsModelItem && actionItem.thingsModelItem.datatype.type == 'enum'">
								<view><uni-data-select v-model="actionItem.value"
										:localdata="actionItem.thingsModelItem.datatype.enumList"
										:clear="false"></uni-data-select></view>
							</view>
							<view
								v-else-if="actionItem.thingsModelItem && actionItem.thingsModelItem.datatype.type == 'string'">
								<u--input v-model="actionItem.value" customStyle="padding:4px 10px;"
									placeholder="请输入字符串"
									:maxlength="actionItem.thingsModelItem.datatype.maxLength"></u--input>
							</view>
							<view
								v-else-if="actionItem.thingsModelItem && actionItem.thingsModelItem.datatype.type == 'array'">
								<u--input v-model="actionItem.value" customStyle="padding:4px 10px;"
									placeholder="英文逗号分隔的数组"></u--input>
							</view>
						</view>
					</view>
				</view>
			</u--form>
		</view>

		<view class="card">
			<view style="margin-top:10px;display:flex;">
				<u-button type="error" v-if="isUpdate" @tap="handleDelete" customStyle="margin:10px;">删除</u-button>
				<u-button type="primary" @tap="submitForm" customStyle="margin:10px;">保存</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { getJob, delJob, updateJob, addJob } from '@/apis/modules/deviceJob';
	import { cacheJsonThingsModel } from '@/apis/modules/device';
	export default {
		data () {
			return {
				// 显示
				// actionSheetShow: false,
				// 标题
				actionSheetTitle: '请选择对应的项',
				// 列表
				actionSheetList: [],
				//标题
				title: '添加定时任务',
				isUpdate: false,
				// 显示时间选择
				datetimeShow: false,
				// 物模型
				thingsModel: {},
				// 设备ID
				deviceId: 0,
				// 产品ID
				productId: 0,
				// 设备编号
				serialNumber: '',
				// 传入的表达式
				expression: '',
				// 动作列表
				actionList: [{
					id: '',
					name: '',
					value: '',
					type: 2, // 1=属性，2=功能，3=事件，5=设备上线，6=设备下线
					source: 2, // 1=设备，2=定时，3=告警输出
					deviceId: this.deviceId,
					deviceName: '',
					alertName: '', // 告警名称 可选
					alertLevel: 1, // 告警级别 告警级别（1=提醒通知，2=轻微问题，3=严重警告）
					thingsModelItem: {
						id: '',
						name: '',
						datatype: {
							type: ''
						}
					}
				}],
				// 重复执行项
				timerRepeats: [{
						value: 1,
						label: '每天'
					},
					{
						value: 2,
						label: '指定'
					}
				],
				timerRepeatValue: 1,
				// 周
				timerWeeks: [{
						value: 1,
						label: '周一',
						checked: false
					},
					{
						value: 2,
						label: '周二',
						checked: false
					},
					{
						value: 3,
						label: '周三',
						checked: false
					},
					{
						value: 4,
						label: '周四',
						checked: false
					},
					{
						value: 5,
						label: '周五',
						checked: false
					},
					{
						value: 6,
						label: '周六',
						checked: false
					},
					{
						value: 7,
						label: '周日',
						checked: false
					}
				],
				timerWeekValue: [1, 2, 3, 4, 5, 6, 7],
				// 时间
				timerTimeValue: '8:30',
				// 表单参数
				form: {
					jobId: 0,
					jobName: undefined,
					cronExpression: undefined,
					status: '0',
					jobGroup: 'DEFAULT', // 定时分组
					misfirePolicy: 2, // 1=立即执行，2=执行一次，3=放弃执行
					concurrent: 1, // 是否并发，1=禁止，0=允许
					isAdvance: 0, // 是否详细cron表达式
					jobType: 1, // 任务类型 1=设备定时，2=设备告警，3=场景联动
					productId: 0,
					productName: '',
					sceneId: 0, //场景ID
					alertId: 0, // 告警ID
					actions: ''
				},
				// 表单校验
				rules: {
					jobName: [{
						required: true,
						message: '定时名称不能为空',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		onLoad (option) {
			if (option.jobId) {
				this.form.jobId = option.jobId;
				this.title = '修改定时任务';
				this.isUpdate = true;
			}
			this.deviceId = option.deviceId;
			this.productId = option.productId;
			this.serialNumber = option.serialNumber;
			this.getCacheThingsModdel(this.productId);
		},
		methods: {
			// 动作中的物模型改变事件
			thingsModelChange (id, actionItem, index) {
				if (actionItem.type == 1) {
					for (let j = 0; j < this.thingsModel.properties.length; j++) {
						if (id == this.thingsModel.properties[j].id) {
							actionItem.id = this.thingsModel.properties[j].id;
							actionItem.name = this.thingsModel.properties[j].name;
							actionItem.value = this.thingsModel.properties[j].datatype.type == 'bool' ? '1' : '';
							actionItem.thingsModelItem = this.thingsModel.properties[j];
							break;
						}
					}
				} else if (actionItem.type == 2) {
					for (let j = 0; j < this.thingsModel.functions.length; j++) {
						if (id == this.thingsModel.functions[j].id) {
							actionItem.id = this.thingsModel.functions[j].id;
							actionItem.name = this.thingsModel.functions[j].name;
							actionItem.value = this.thingsModel.functions[j].datatype.type == 'bool' ? '1' : '';
							actionItem.thingsModelItem = this.thingsModel.functions[j];
							console.log(this.actionList[index]);
							break;
						}
					}
				}
			},
			/**物模型类型改变*/
			thingsModelTypeChange (actionItem, value) {
				if (actionItem.type != value) {
					actionItem.type = actionItem.type == 1 ? 2 : 1;
					(actionItem.id = ''),
					(actionItem.name = ''),
					(actionItem.value = ''),
					(actionItem.thingsModelItem = {
						id: '',
						name: '',
						datatype: {
							type: ''
						}
					});
				}
			},
			/** 获取物模型*/
			getCacheThingsModdel (productId) {
				// 获取缓存的Json物模型
				cacheJsonThingsModel(productId).then(response => {
					this.thingsModel = JSON.parse(response.data);
					// 过滤监测数据，监测数据为只读
					this.thingsModel.properties = this.thingsModel.properties && this.thingsModel.properties
						.filter(item => item.isMonitor == 0);
					if (this.thingsModel.functions) {
						for (let i = 0; i < this.thingsModel.functions.length; i++) {
							this.thingsModel.functions[i].text = this.thingsModel.functions[i].name;
							this.thingsModel.functions[i].value = this.thingsModel.functions[i].id;
						}
					}
					if (this.thingsModel.properties) {
						for (let i = 0; i < this.thingsModel.properties.length; i++) {
							this.thingsModel.properties[i].text = this.thingsModel.properties[i].name;
							this.thingsModel.properties[i].value = this.thingsModel.properties[i].id;
						}
					}
					if (this.form.jobId != 0) {
						this.getInfo();
					}
					console.log('thingsModel', this.thingsModel);
				});
			},
			// 单击选择事件
			dateTimeClick () {
				if (this.form.isAdvance != 1) {
					this.datetimeShow = true;
				}
			},
			//时间选择取消
			dateTimeCancel () {
				this.datetimeShow = false;
			},
			// 时间选择确认
			dateTimeConfirm (data) {
				this.timerTimeValue = data.value;
				this.datetimeShow = false;
			},
			// 获取定时详情
			getInfo () {
				getJob(this.form.jobId).then(response => {
					this.form = response.data;
					// actionList赋值
					this.actionList = JSON.parse(this.form.actions);
					for (let i = 0; i < this.actionList.length; i++) {
						if (this.actionList[i].type == 1) {
							for (let j = 0; j < this.thingsModel.properties.length; j++) {
								if (this.actionList[i].id == this.thingsModel.properties[j].id) {
									this.actionList[i].thingsModelItem = this.thingsModel.properties[j];
									break;
								}
							}
						} else if (this.actionList[i].type == 2) {
							for (let j = 0; j < this.thingsModel.functions.length; j++) {
								if (this.actionList[i].id == this.thingsModel.functions[j].id) {
									this.actionList[i].thingsModelItem = this.thingsModel.functions[j];
									break;
								}
							}
						}
					}
					if (this.form.isAdvance == 0) {
						// 解析执行时间和重复执行项
						if (this.form.cronExpression.substring(12) == '1,2,3,4,5,6,7') {
							this.timerRepeatValue = 1; // 每天
						} else {
							this.timerRepeatValue = 2; // 指定
						}
						let arrayValue = this.form.cronExpression
							.substring(12)
							.split(',')
							.map(Number);
						this.timerWeekValue = arrayValue;
						this.setWeekStatus(arrayValue);
						this.timerTimeValue = this.form.cronExpression.substring(5, 7) + ':' + this.form
							.cronExpression.substring(2, 4);
					}
					console.log('actionList', this.actionList);
				});
			},
			/**设置一周天数的状态*/
			setWeekStatus (selectedArray) {
				for (let i = 0; i < this.timerWeeks.length; i++) {
					this.timerWeeks[i].checked = false;
					for (let j = 0; j < selectedArray.length; j++) {
						if (this.timerWeeks[i].value == selectedArray[j]) {
							this.timerWeeks[i].checked = true;
						}
					}
				}
			},
			/** 添加枚举项 */
			addEnumItem () {
				this.actionList.push({
					id: '',
					name: '',
					value: '',
					type: 2, // 1=属性，2=功能，3=事件，5=设备上线，6=设备下线
					source: 2, // 1=设备，2=定时，3=告警输出
					deviceId: this.deviceId,
					deviceName: '',
					alertName: '', // 告警名称 可选
					alertLevel: 1, // 告警级别 告警级别（1=提醒通知，2=轻微问题，3=严重警告）
					thingsModelItem: {
						id: '',
						name: '',
						datatype: {
							type: ''
						}
					}
				});
			},
			/** 删除枚举项 */
			removeEnumItem (index) {
				this.actionList.splice(index, 1);
			},
			/** 修改重复执行事件 **/
			repeatChange (data) {
				this.timerWeekValue = [1, 2, 3, 4, 5, 6, 7];
				this.setWeekStatus(this.timerWeekValue);
			},
			/** 星期改变事件 **/
			weekChange (data) {
				if (this.form.isAdvance != 1) {
					if (!this.timerWeeks[data - 1].checked) {
						// 添加
						this.timerWeekValue.push(data);
					} else {
						// 删除
						for (let i = 0; i < this.timerWeekValue.length; i++) {
							if (data == this.timerWeekValue[i]) {
								this.timerWeekValue.splice(i, 1);
								break;
							}
						}
					}
					this.setWeekStatus(this.timerWeekValue);
				}
			},
			/** 生成cron表达式**/
			gentCronExpression () {
				let hour = '00';
				let minute = '00';
				if (this.timerTimeValue != null && this.timerTimeValue != '') {
					let index = this.timerTimeValue.indexOf(':');
					hour = this.timerTimeValue.substring(0, index)
					minute = this.timerTimeValue.substring(index + 1);
				}
				let week = '*';
				if (this.timerWeekValue.length > 0) {
					week = this.timerWeekValue.sort();
				}
				this.form.cronExpression = '0 ' + minute + ' ' + hour + ' ? * ' + week;
			},

			// 删除
			handleDelete () {
				uni.showModal({
					title: '',
					content: '确定删除定时任务吗？',
					success: result => {
						if (result.confirm) {
							uni.showLoading({ title: '删除中...' });
							delJob(this.form.jobId)
								.then(res => {
									if (res) {
										uni.showToast({
											icon: 'success',
											title: res.msg
										});
										setTimeout(() => {
											this.goBack();
										}, 1000);
										// 列表更新
										//this.getList();
									}
								})
								.finally(() => {
									uni.hideLoading();
								});
						}
					}
				});
			},
			// 提交
			submitForm () {
				this.$refs.form.validate().then(res => {
					// 生成corn表达式
					this.gentCronExpression();
					// 验证不能为空
					if (this.timerTimeValue == '' || this.timerTimeValue == null) {
						uni.showToast({
							icon: 'none',
							title: '执行时间不能空',
							duration: 3000
						});
						return;
					}
					if (this.timerRepeatValue == 2 && (this.timerWeekValue == null || this.timerWeekValue == '')) {
						uni.showToast({
							icon: 'none',
							title: '请选择要执行的星期',
							duration: 3000
						});
						return;
					}
					if (this.form.cronExpression == undefined || this.form.cronExpression == '') {
						uni.showToast({
							icon: 'none',
							title: 'cron表达式不能为空',
							duration: 3000
						});
						return;
					}
					for (let i = 0; i < this.actionList.length; i++) {
						if (this.actionList[i].id == '' || this.actionList[i].name == '' || this.actionList[i]
							.value == '') {
							uni.showToast({
								icon: 'none',
								title: '执行动作中的选项和值不能为空',
								duration: 3000
							});
							return;
						}
					}
					// 动作
					this.actionList[0].deviceId = this.deviceId;
					this.actionList[0].deviceName = this.deviceName;
					// 删除对象中的物模型属性
					for (let i = 0; i < this.actionList.length; i++) {
						this.$delete(this.actionList[i], 'thingsModelItem');
					}
					this.form.actions = JSON.stringify(this.actionList);
					// 设备信息
					this.form.deviceId = this.deviceId;
					this.form.deviceName = '';
					this.form.serialNumber = this.serialNumber;
					this.form.productId = this.productId;
					this.form.productName = '';
					uni.showLoading({ title: '提交中...' });
					if (this.form.jobId != 0) {
						updateJob(this.form)
							.then(response => {
								if (response.code == 200) {
									uni.showToast({ icon: 'success', title: '修改成功' });
									setTimeout(() => {
										this.goBack();
									}, 1000);
								} else {
									uni.showToast({ icon: 'none', title: response.msg });
								}
							})
							.finally(() => {
								uni.hideLoading();
							});
					} else {
						addJob(this.form)
							.then(response => {
								if (response.code == 200) {
									uni.showToast({ icon: 'success', title: '新增成功' });
									setTimeout(() => {
										this.goBack();
									}, 1000);
								} else {
									uni.showToast({ icon: 'none', title: response.msg });
								}
							})
							.finally(() => {
								uni.hideLoading();
							});
					}
				});
			},
			// 返回
			goBack () {
				getApp().globalData.operate = 'timer';
				uni.navigateBack({
					delta: 1
				});
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

	.card {
		box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
		border-radius: 6px;
		/* border: 1px solid #dfdfdf; */
		background-color: #fff;
		margin: 10px;
		padding: 10px 20px 20px 20px;
	}

	.action {
		padding: 15px;
		border: 1px solid #eee;
		background-color: #fdfdfd;
		border-radius: 10px;
		margin: 0 -10px 20px;
	}

	/* 下拉框 */
	/deep/ .uni-select__selector {
		white-space: nowrap !important;
	}

	/deep/ .uni-select__input-box {
		overflow: hidden !important;
	}
</style>