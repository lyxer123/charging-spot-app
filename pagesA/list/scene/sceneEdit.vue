<template>
	<page-meta>
		<navigation-bar :title="title" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="container">
		<view class="sceneWrap">
			<u--form labelPosition="left" :model="form" :rules="rules" ref="form" labelWidth="100" labelAlign="center">
				<u-form-item label="场景名称" prop="sceneName" required borderBottom>
					<u--input v-model="form.sceneName" border="none" placeholder="请输入场景名称"></u--input>
				</u-form-item>
				<u-form-item label="场景状态" prop="groupOrder" borderBottom>
					<u-switch v-model="form.status" :activeValue='1' :inactiveValue='0' customStyle="border-radius:3px;"
						size="20" @change="change"></u-switch>
				</u-form-item>
				<u-form-item label="备注" prop="remark" borderBottom>
					<u--input v-model="form.remark" border="none" placeholder="请输入内容"></u--input>
				</u-form-item>
			</u--form>
		</view>
		<view class="trigger_wrap">
			<view class="trigger_header">
				<text class="trigger_title">触发器</text>
				<u-icon name="plus-circle-fill" color="#2979ff" size="28" @click="handleAddTrigger"></u-icon>
			</view>
			<Trigger ref="trigger" :triggersDetail='triggersDetail'></Trigger>
		</view>
		<view class="execute_wrap">
			<view class="execute_header">
				<text class="execute_title">执行动作</text>
				<u-icon name="plus-circle-fill" color="#2979ff" size="28" @click="handleAddExecute"></u-icon>
			</view>
			<Execute ref="execute" :actionsDetail='actionsDetail'></Execute>
		</view>
		<view style="margin-top:40px;display:flex;">
			<u-button type="error" v-if="isUpdate" @tap="delScene(form.sceneId)" customStyle="margin-right:10px;">删除
			</u-button>
			<u-button type="primary" @tap="submitForm" customStyle="margin-left:10px;">保存</u-button>
		</view>
	</view>
</template>

<script>
	import Trigger from '../../public/trigger/index.vue'
	import Execute from '../../public/execute/index.vue'
	import {
		addScene,
		updateScene,
		getScene,
		delScene
	} from '@/apis/modules/scene';
	export default {
		components: {
			Trigger,
			Execute
		},
		data () {
			return {
				title: '场景详情',
				isUpdate: false, //是否显示删除
				form: {
					sceneId: null,
					sceneName: '', //场景名称
					status: 1, //场景开关
					remark: '',
					userId: '',
					userName: '',
					triggers: '', //触发器
					actions: '' //执行动作
				},
				rules: {
					sceneName: [{
						required: true,
						message: '请输入场景名称',
						trigger: ['blur', 'change']
					}]
				},
				sceneId: '', //场景联动详情id
				sceneIdDetail: {}, //场景联动详情
				triggersDetail: [], //触发器子组件详情
				actionsDetail: [] //执行动作子组件详情
			};
		},
		onLoad (option) {

			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			//this.$refs.form.setRules(this.rules)

			if (option.sceneId) {
				console.log(option, '携带参数')
				this.sceneId = option.sceneId
				this.isUpdate = true
				this.getScene()
				console.log(this.sceneId, '1111')
			}
		},
		methods: {
			submitForm () {
				let triggerFormData = this.$refs['trigger'].getFormData().triggerList;
				let executeFormData = this.$refs['execute'].getFormData().triggerList;
				console.log(triggerFormData, '触发器');
				this.$refs.form.validate().then(res => {
					//校验触发器
					for (let i = 0; i < triggerFormData.length; i++) {
						// 设备升级、上线、下线
						if (triggerFormData[i].type === 4 || triggerFormData[i].type === 5 || triggerFormData[i]
							.type === 6) {
							continue;
						}
						// 值不能为空
						if (triggerFormData[i].source == 1) {
							if (triggerFormData[i].id === "" || triggerFormData[i].name === "" || triggerFormData[
									i].value === "") {
								uni.showToast({
									icon: 'none',
									title: '触发器中的选项和值不能为空',
								});
								return;
							}
							delete triggerFormData[i].timerTimeValue;
							delete triggerFormData[i].timerWeekValue;
						}
						if (triggerFormData[i].source == 2) {
							if (triggerFormData[i].timerTimeValue === "" || triggerFormData[i].timerTimeValue ===
								null) {
								uni.showToast({
									icon: 'none',
									title: '执行时间不能空'
								});
								return;
							}
							if (triggerFormData[i].timerWeekValue === null || triggerFormData[i].timerWeekValue ===
								"") {
								uni.showToast({
									icon: 'none',
									title: '请选择要执行的星期'
								});
								return;
							}
							let hour = "00";
							let minute = "00";
							if (triggerFormData[i].timerTimeValue !== null && triggerFormData[i].timerTimeValue !==
								"") {
								hour = triggerFormData[i].timerTimeValue.substring(0, 2);
								minute = triggerFormData[i].timerTimeValue.substring(3);
							}
							let week = "*";
							if (triggerFormData[i].timerWeekValue.length > 0) {
								week = triggerFormData[i].timerWeekValue.sort();
							}
							triggerFormData[i].cronExpression = "0 " + minute + " " + hour + " ? * " + week;
						}
						// 清空不需要提交数据
						delete triggerFormData[i].thingsModelItem;
						delete triggerFormData[i].thingsModel;

						// delete triggerFormData[i].timerWeekRepeatValue;
					}

					// 动作验证
					for (let v = 0; v < executeFormData.length; v++) {
						if (executeFormData[v].id === "" || executeFormData[v].name === "" || executeFormData[v]
							.value === "") {
							uni.showToast({
								icon: 'none',
								title: '执行动作中的选项和值不能为空'
							});
							return;
						}
						// 清空不需要提交数据
						delete executeFormData[v].thingsModelItem;
						delete executeFormData[v].thingsModel;
					}

					this.form.userId = 1;
					this.form.userName = "admin";
					this.form.triggers = JSON.stringify(triggerFormData);
					this.form.actions = JSON.stringify(executeFormData);
					if (this.form.sceneId != null) {
						updateScene(this.form).then(response => {
							if (response.code === 200) {
								uni.showToast({
									icon: 'success',
									title: '修改成功',
									duration: 2000
								});
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/tabBar/scene/scene',
										success: (e) => {
											var page = getCurrentPages().pop();
											if (page === undefined || page === null)
												return;
											// 更新scene列表
											if (uni.getSystemInfoSync().platform ===
												'devtools') {
												page.$vm.resetList();
											} else {
												page.resetList();
											}
										}
									});
								}, 2000)
							}

						});
					} else {
						addScene(this.form).then(response => {
							if (response.code === 200) {
								uni.showToast({
									icon: 'success',
									title: '新增成功',
									duration: 2000
								});
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/tabBar/scene/scene',
										success: (e) => {
											var page = getCurrentPages().pop();
											if (page === undefined || page === null)
												return;
											// 更新scene列表
											if (uni.getSystemInfoSync().platform ===
												'devtools') {
												page.$vm.resetList();
											} else {
												page.resetList();
											}
										}
									});
								}, 2000)
							}
						});
					}
				}).catch(errors => {
					console.log('校验失败')
				})

				console.log(triggerFormData, '父组件取值')
			},
			//获取场景联动详情
			getScene () {
				getScene(this.sceneId).then(response => {
					this.sceneIdDetail = response.data
					this.form.sceneId = response.data.sceneId
					this.form.sceneName = response.data.sceneName
					this.form.status = response.data.status
					this.form.remark = response.data.remark
					this.form.userId = response.data.userId
					this.form.userName = response.data.userName
					this.form.triggers = response.data.triggers
					this.form.actions = response.data.actions
					this.triggersDetail = JSON.parse(response.data.triggers)
					this.actionsDetail = JSON.parse(response.data.actions)
					console.log(response, '场景联动详情')
				});
			},
			//删除场景联动
			delScene (id) {
				delScene(id)
					.then(response => {
						if (response.code === 200) {
							uni.showToast({
								icon: 'success',
								title: '删除成功',
								duration: 2000
							});
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/tabBar/scene/scene',
									success: (e) => {
										var page = getCurrentPages().pop();
										if (page === undefined || page === null) return;
										// 更新scene列表
										if (uni.getSystemInfoSync().platform === 'devtools') {
											page.$vm.resetList();
										} else {
											page.resetList();
										}
									}
								});
							}, 2000)
						}
					})
					.catch(e => {
						console.log(e);
					});
			},
			// 新增触发器事件
			handleAddTrigger () {
				this.$refs.trigger.addTragger();
			},
			// 新增执行动作
			handleAddExecute () {
				this.$refs.execute.addExecute();
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #eef3f7;
	}

	.u-checkbox-group {
		flex-wrap: wrap;
	}

	.container {
		padding: 10px;
		padding-bottom: 100px;

		.sceneWrap {
			background: #fff;
			border-radius: 8px;
			padding: 0 12px;

			/deep/ .u-form-item__body__left__content__required {
				left: 0px;
			}

			/deep/ .u-form-item:last-child {
				.u-line {
					border-bottom: red !important;
				}
			}
		}

		.trigger_wrap,
		.execute_wrap {
			background: #fff;
			border-radius: 8px;
			padding: 0 12px;
			margin-top: 20px;

			.trigger_header,
			.execute_header {
				display: flex;
				flex-direction: row;
				margin: 0px;
				padding: 0px 10px;
				border-bottom: 1px solid rgb(214, 215, 217);

				.trigger_title,
				.execute_title {
					flex: 1;
					font-size: 18px;
					color: #000000;
					font-weight: 400;
					line-height: 36px;
					padding: 8px 0;
				}
			}
		}
	}
</style>